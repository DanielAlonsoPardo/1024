import MersenneTwister from 'mersenne-twister'

/* Index
 * 
 * Engine prototypes:
 *   update_max_number(number)
 *   moves_available() => boolean
 *   slide_numbers_raw(slideAwayFromStart, slideVertically) => boolean
 *   place_2_4() => boolean
 *   place_randomly(number) => boolean
 *   count_empty_cells() => int
 *   update_game_state()
 *   on_slide(callback(number, slideDir))
 *   on_combine(callback(number, number, slideDir))
 *   on_place(callback(number))
 *   log_board()
 */

/** Engine
 *
 * Engine for a 2048-like game where you slide numbers around and manage rng.
 * This engine features:
 *   An nxn board that you can place numbers on.
 *   Gamestate tracking (turn counter, score, max number on board...)
 *   An included, seedable random number generator
 *
 * The purpose of including the RNG is to enable deterministic outcomes,
 *   for example to allow replaying recorded games.
 */

/**
 * Attributes:
 *   board -> The board, containing all numbers in play.
                It is a square of side `boardsize`, typically 4x4.
 *   seed -> seed used when initializing the game
 *   game_state ->
 *     move_count -> adds one on every succesfull call to slide_numbers_raw()
 *     zero_count -> number of empty cells, updated on slide and random placement.
 *     max_number -> highest number on the board. updated on slide and random placement.
 *     score -> current score. Increases every time two numbers combine, by the resulting number.
 *   callbacks ->
 *     on_slide   -> called whenever any number slides.
 *     on_combine -> called whenever two numbers combine.
 *     on_place   -> called whenever a new number is placed on the board.
 */
export class Engine {
  /* Creates an empty board, ready to play */
  /* this.board[row][col] */
  constructor(boardsize, seed) {
    if (boardsize < 1 || boardsize > 16)
      throw "Boards of size " + boardsize + "are not permitted";
    this.board = Array(boardsize);
    for (let i = 0; i < boardsize; i++)
      this.board[i] = Array(boardsize).fill(0);

    this.seed = seed;
    this.rng = new MersenneTwister(seed);
    this.callbacks = {};

    this.game_state = {
      move_count: 0,
      zero_count: boardsize**2,
      max_number: 0,
      score: 0
    };
  }

  /**
   * overwrites max_number if given number is higher
   *
   */
  update_max_number(number) {
    if (this.game_state.max_number < number)
      this.game_state.max_number = number;
  }

  /** moves_available
   * Returns true if there are any moves left on the board that are possible.
   *         false otherwise.
   */
  moves_available() {
    if (this.game_state.zero_count > 0)
      return true;

    //true if given cell has a combinable number to the right, or below
    //assumes no empty cells on the board
    let number_is_combinable_lr = (row, col) => {
      if (row < this.board.length - 1) //below
        if (this.board[row][col] == this.board[row+1][col])
          return true

      if (col < this.board.length - 1) //to the right
        if (this.board[row][col] == this.board[row][col+1])
          return true

      return false;
    }

    //check to see if any number is next to another equal number
    for (let row = 0; row < this.board.length; row++)
      for (let col = 0; col < this.board.length; col++)
        if (number_is_combinable_lr(row, col))
          return true;

    return false;
  }
  
  /** slide_numbers_raw
   *
   * Slide numbers on the board in a given direction, if the move is legal.
   *   A move is legal if it results in movement on the board.
   *   Game stats (like turn counter) are updated if the move succeeds.
   *
   *   slideAwayFromStart -> are numbers sliding either right or down?
   *   slideVertically    -> are numbers sliding either up or down?
   *
   *   Returns: true if the slide was succesful, false otherwise.
   * 
   * Some rules for sliding:   
   *   - Zeros are empty cells, and any number can slide into it
   *   - Two equal numbers that slide into each other combine into one by addition
   *   - You can't chain combinations
   *
   * The 'start' that 'slideAwayFromStart' is referring to is top left (board[0][0])
   * You can control which of the four sides of a board to slide towards like so:
   *   Right: slide_numbers_raw(true, false)
   *   Left: slide_numbers_raw(false, false)
   *   Up: slide_numbers_raw(false, true)
   *   Down: slide_numbers_raw(true, true)
   */
  set_cell_vertical = (col, cell, value) => this.board[cell][col] = value;
  get_cell_vertical = (col, cell) => this.board[cell][col];
  set_cell_horizontal = (row, cell, value) => this.board[row][cell] = value;
  get_cell_horizontal = (row, cell) => this.board[row][cell];
  slide_numbers_raw(slideAwayFromStart, slideVertically) {
    //these functions are essentially used to iterate through board cells
    //they change depending on what side you're sliding towards
    //sliding right/down or up/left?
    let lower_side = (slideAwayFromStart ? this.board.length - 1 : 0);
    let higher_side = (slideAwayFromStart ? 0 : this.board.length - 1);
    let next_position = (slideAwayFromStart ? (c => c-1) : (c => c+1) );
    let cell_within_bounds = (slideAwayFromStart ? (c => (c >= higher_side)) : (c => (c <= higher_side)));
    //sliding up or down?
    let set_cell = (slideVertically ? this.set_cell_vertical : this.set_cell_horizontal);
    let get_cell = (slideVertically ? this.get_cell_vertical : this.get_cell_horizontal);

    let a_number_moved = false;

    //for each row (or column) of cells
    for (let row = 0; row < this.board.length; row++) {
      let from = next_position(lower_side);
      let to = lower_side;

      //slide them to one side
      while(cell_within_bounds(from)) {
        if (get_cell(row, to) == 0) {
          //'to' cell is empty -> slide 'from' into it
          //...if 'from' has something
          if (get_cell(row, from) != 0) {
            this.slide_callback(row, from, to, slideAwayFromStart, slideVertically);
            set_cell(row, to, get_cell(row, from));
            set_cell(row, from, 0);
            a_number_moved = true;
          }
        } else {
          if (get_cell(row, to) == get_cell(row, from)) {
            //'to' can be combined with 'from'
            this.slide_callback(row, from, to, slideAwayFromStart, slideVertically);
            this.combine_callback(row, from, to, slideAwayFromStart, slideVertically);
            set_cell(row, to, get_cell(row, from) + get_cell(row, to));
            this.update_max_number(get_cell(row, to));
            this.game_state.score += get_cell(row, to);
            this.game_state.zero_count++;
            set_cell(row, from, 0);
            a_number_moved = true;
            to = next_position(to);
          } else if (get_cell(row, from) != 0) {
            //'to' can't be combined with 'from'
            to = next_position(to);
            if (from != to) {
              //there's room to slide 'to' towards 'from'
              set_cell(row, to, get_cell(row, from));
              set_cell(row, from, 0);
              a_number_moved = true;
            }
          }
        }
        from = next_position(from);
      }
    }
    if (a_number_moved)
      this.game_state.move_count += 1;
    return a_number_moved;
  }

  /**
   * Place a 2 or a 4 on the board, randomly (on a 90/10 split)
   * See `place_randomly()`
   */
  place_2_4() {
    return this.place_randomly((this.rng.random() < 0.90) ? 2 : 4 );
  }

  /**
   *  Place a given number on the board, in a random empty cell.
   *    Updates game_state.
   *
   *    number -> number to place on board.
   *
   *    returns: true if it was successfully placed, false otherwise.
   */
  place_randomly(number) {
    if (number <= 0 || this.game_state.zero_count <= 0)
      return false;

    let target_cell = Math.floor(this.game_state.zero_count * this.rng.random());

    let current_empty_cell = 0;
    let row, col;
    for (row = 0; row < this.board.length || current_empty_cell <= target_cell; row++) {
      for (col = 0; col < this.board.length; col++) {
        if (this.board[row][col] == 0) {
          if (current_empty_cell == target_cell) {
            this.board[row][col] = number;
            current_empty_cell++;
            break;
          } else {
            current_empty_cell++;
          }
        }
      }
    }

    this.update_max_number(number)
    this.game_state.zero_count--;

    this.callbacks?.on_place?.({
      value: number,
      position: {
        column: col,
        row: row
      }
    });


    return true;
  }

  /**
   *  count the number of empty cells on the board and updates this.game_state.zero_count
   *  returns: the count
   */
  count_empty_cells() {
    let count = 0;
    for (let row of this.board)
      for (let cell of row)
        if (cell == 0) count ++;
    this.game_state.zero_count = count;
    return count;
  }

  /** update_game_state()
   *
   * Updates max number on board and zero count.
   *   Does not change turn count or score.
   */
  update_game_state() {
    let count = 0;
    let max = 0;
    for (let row of this.board) {
      for (let cell of row) {
        if (cell == 0) count ++;
        if (max < cell) max = cell;
      }
    }
    this.game_state.zero_count = count;
    this.game_state.max_number = max;
  }


  /** numberInfo
   *  Describes a given number on the board
   *
   *    numberInfo: {
   *      value,
   *      position: { column, row }
   *    }
   */
  /** slideInfo
   *  Describe how far and in what direction a given number on the board moved
   *
   *    slideInfo: {
   *      from, // relative to the slide direction
   *      to, // relative to the slide direction
   *      slideAwayFromStart, // see slide_numbers_raw
   *      slideVertically
   *    }
   */

  /** on_slide
   *  Provides a hook to execute callbacks before sliding numbers.
   *  Combining numbers implies at least one on_slide event.
   *
   *  callback(numberToSlide, slideInfo)
   *    numberToSlide -> numberInfo of the number (before moving)
   *    slideInfo -> type of slide to be performed
   */
  on_slide(callback) {
    this.callbacks.on_slide = callback;
  }

  slide_callback(row, from, to, slideAwayFromStart, slideVertically) {
    if (!this.callbacks?.on_slide)
      return;

    let get_cell = (slideVertically ? this.get_cell_vertical : this.get_cell_horizontal);
    let get_row = (slideAwayFromStart ? (row, col) => col : (row, col) => row);
    let get_col = (slideAwayFromStart ? (row, col) => row : (row, col) => col);

    let numberInfo = {
      value: get_cell(row, from),
      position: {
        row: get_row(row, from),
        column: get_col(row, from)
      }
    }
    let slideInfo = {
      from, to, slideAwayFromStart, slideVertically
    }

    this.callbacks.on_slide(numberInfo, slideInfo);
  }

  /** on_combine
   *  Provides a hook to execute callbacks before combining numbers
   *
   *  callback(combinedNumberInfo)
   *
   *
   */
  on_combine(callback) {
    this.callbacks.on_combine = callback;
  }

  combine_callback(row, from, to, slideAwayFromStart, slideVertically) {
    if (!this.callbacks?.on_combine)
      return;

    let get_cell = (slideVertically ? this.get_cell_vertical : this.get_cell_horizontal);
    let get_row = (slideAwayFromStart ? (row, col) => col : (row, col) => row);
    let get_col = (slideAwayFromStart ? (row, col) => row : (row, col) => col);

    let combinedNumber = {
      value: get_cell(row, from) + get_cell(row, to),
      position: {
        row: get_row(row, to),
        column: get_col(row, to)
      }
    }

    this.callbacks.on_combine(combinedNumber);
  }

  /** on_place(callback)
   *  Provides a hook to execute callbacks on placing numbers.
   *
   *  callback(numberPlaced)
   *    numberPlaced: numberInfo of the number that was just placed on the board
   */
  on_place(callback) {
    this.callbacks.on_place = callback;
  }

  log_board = () => {
    for (const l of this.board)
      console.log(l)
    console.log()
  }
}