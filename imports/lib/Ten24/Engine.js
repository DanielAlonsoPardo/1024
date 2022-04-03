import MersenneTwister from 'mersenne-twister'

/**
 * Attributes:
 *   board -> current gamestate. Is always a _square_ of size `boardsize`
 *   seed -> seed used when initializing the game
 *   move_count -> adds one on every succesfull call to slide_numbers_raw()
 *   zero_count -> number of empty cells, updated on slide and random placement.
 *   max_number -> highest number on the board. updated on slide and random placement.
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

    this.move_count = 0;
    this.zero_count = boardsize**2;
    this.max_number = 0;
  }

  /**
   * overwrites max_number if given number is higher
   *
   */
  update_max_number(number) {
    if (this.max_number < number)
      this.max_number = number;
  }

  /** moves_available
   * Returns true if there are any moves left on the board that are possible.
   *         false otherwise.
   */
  moves_available(number) {
    if (this.zero_count > 0)
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
  
  /**
   * Slide or combine numbers on the board as far as possible in some direction.
   *   - Zeros are empty cells, and any number can slide into it
   *   - Two equal numbers that slide into each other combine into one by addition
   *   - You can't chain combinations
   * 
   *   slideAwayFromStart -> are numbers sliding either right or down?
   *   slideVertically -> are numbers sliding either up or down?
   * 
   * 
   *
   * The 'start' that 'slideAwayFromStart' is referring to is top left (board[0][0])
   * You can control which of the four sides of a board to slide towards like so:
   *   Right: slide_numbers_raw(true, false)
   *   Left: slide_numbers_raw(false, false)
   *   Up: slide_numbers_raw(false, true)
   *   Down: slide_numbers_raw(true, true)
   */
  slide_numbers_raw(slideAwayFromStart, slideVertically) {
    let lower_side;
    let higher_side;
    //these functions are essentially used to iterate through board cells
    //they change depending on what side you're sliding towards
    let next_position;
    let cell_within_bounds;
    let set_cell
    let get_cell

    let a_number_moved = false;


    //sliding towards or away from start (0,0)?
    if (slideAwayFromStart) {//either right or down
      lower_side = this.board.length - 1;
      higher_side = 0;
      next_position = c => c-1;
      cell_within_bounds = c => (c >= higher_side)
    } else {//either up or left
      lower_side = 0;
      higher_side = this.board.length - 1;
      next_position = c => c+1;
      cell_within_bounds = c => (c <= higher_side);
    }

    //sliding vertically or horizontally?
    if (slideVertically) {//either up or down
      //go column by column
      set_cell = (col, cell, value) => this.board[cell][col] = value
      get_cell = (col, cell) => this.board[cell][col]
    } else {//either left or right
      //go row by row
      set_cell = (row, cell, value) => this.board[row][cell] = value
      get_cell = (row, cell) => this.board[row][cell]
    }

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
            set_cell(row, to, get_cell(row, from));
            set_cell(row, from, 0);
            a_number_moved = true;
          }
        } else {
          if (get_cell(row, to) == get_cell(row, from)) {
            //'to' can be combined with 'from'
            set_cell(row, to, get_cell(row, from) + get_cell(row, to));
            this.update_max_number(get_cell(row, to));
            this.zero_count++;
            set_cell(row, from, 0);
            to = next_position(to);
            a_number_moved = true;
          } else if (get_cell(row, from) != 0) {
            //'to' can't be combined with 'from'
            to = next_position(to);
            if (from != to) {
              //there's room to slide 'to' towards 'from'
              set_cell(row, to, this.board[row][from]);
              set_cell(row, from, 0);
              a_number_moved = true;
            }
          }
        }
        from = next_position(from);
      }
    }
    if (a_number_moved)
      this.move_count += 1;
    return a_number_moved;
  }

  /**
   *  place a given number on the board, in a random empty cell.
   *
   *  returns: true if it was successfully placed, false otherwise.
   */
  place_randomly(number) {
    if (number <= 0)
      return true;
    if (this.zero_count <= 0)
      return false;

    let target_cell = Math.floor(this.zero_count * this.rng.random());

    let current_empty_cell = 0;
    for (let row = 0; row < this.board.length || current_empty_cell <= target_cell; row++) {
      for (let col = 0; col < this.board.length; col++) {
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
    this.zero_count--;

    return true;
  }

  /**
   *  count the number of empty cells on the board and updates this.zero_count
   *  returns: the count
   */
  count_empty_cells() {
    let count = 0;
    for (let row of this.board)
      for (let cell of row)
        if (cell == 0) count ++;
    this.zero_count = count;
    return count;
  }

  log_board = () => {
    for (const l of this.board)
      console.log(l)
    console.log()
  }
}