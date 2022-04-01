/** Ten24
 *
 *  Yet Another clone of 1024, the famous game where you combine numbers into bigger numbers.
 *
 *  Featuring:
 *    - a 4x4 board
 *    - squares with numbers
 *    - and...
 *           ...rng
 *
 *
 *  This implementation functions as a game engine but also as a replay verifier, that is, it must be able to confirm that a given set of inputs are indeed possible to play out. This is meant to be used to verify high-scores before posting them on a leaderboard, as another anti-cheat tool.
 *  To this end, games themselves must be entirely deterministic. Since this game features... ...rng, the solution is to supply a randomly chosen rng-seed at the start of the game.
 *
 */
console.log("loading 1024...");

export class Engine {
  /* Creates an empty board, ready to play */
  /* this.board[row][col] */
  constructor(boardsize, seed) {
    if (boardsize < 1 || boardsize > 16)
      throw "Boards of size " + boardsize + "are not permitted";
    this.board = Array(boardsize);
    this.seed = seed;
    this.turn_count = 0;

    for (let i = 0; i < boardsize; i++)
      this.board[i] = Array(boardsize).fill(0);
  }


/**
 * Slide or combine numbers on the board as far as possible in some direction.
 *   - Zeros are empty cells, and any number can slide into it
 *   - Two equal numbers that slide into each other combine into one by addition
 *   - You can't chain combinations
 */

  //
  /**
   * slide numbers from "higher" side to "lower" side
   *
   * the 'start' that 'slideAwayFromStart' is referring to is top left (board[0][0])
   * You can control which of the four sides of a board to slide towards like so:
   *   Right: slide_numbers_raw(true, false)
   *   Left: slide_numbers_raw(false, false)
   *   Up: slide_numbers_raw(false, true)
   *   Down: slide_numbers_raw(true, true)
   */
//  slide_numbers_raw(high_position, low_position, vertical) {
  slide_numbers_raw(slideAwayFromStart, slideVertically) {
    let lower_side;
    let higher_side;
    //these functions are essentially used to iterate through board cells
    //they change depending on what side you're sliding towards
    let next_position;
    let cell_within_bounds;
    let set_cell
    let get_cell

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
          }
        } else {
          if (get_cell(row, to) == get_cell(row, from)) {
            //'to' can be combined with 'from'
            set_cell(row, to, get_cell(row, from) + get_cell(row, to));
            set_cell(row, from, 0);
            to = next_position(to);
          } else if (get_cell(row, from) != 0) {
            //'to' can't be combined with 'from'
            to = next_position(to);
            if (from != to) {
              //there's room to slide 'to' towards 'from'
              set_cell(row, to, this.board[row][from]);
              set_cell(row, from, 0);
            }
          }//else 'to' is zero and can be skipped
        }
        from = next_position(from);
      }
    }
  }

  log_board = () => {
    for (const l of engine.board)
      console.log(l)
    console.log()
  }
}