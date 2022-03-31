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
  constructor(boardsize, seed) {
    if (boardsize < 1 || boardsize > 16)
      throw "Boards of size " + boardsize + "are not permitted";
    this.board = Array(boardsize);
    this.seed = seed;
    this.turn_count = 0;

    for (let i = 0; i < boardsize; i++)
      this.board[i] = Array(boardsize).fill(0);
  }
}

export const Ten24 = () => {


  return 
}