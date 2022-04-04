include { Game } from './Ten24'
/** Game_replay
 *
 * This will take a recorded game and replay it, step by step.
 *   Given the same recorded game, it should always come to the same end gamestate.
 *   This can be used to validate replays as more or less legitimate. Sort of.
 *
 *  
 *  Attributes:
 *    - game
 *
 *  Methods:
 *    - [Symbol.iterator] // enable iteration
 *    - next() // play the recorded game move by move
 *    - done() // true if there are no more moves to process
 *    - play() // plays the current game to completion
 *    - validate(target_game_state) => boolean // plays the current game to completion,
 *                                                  then compares the achieved game
 *                                                  state with the one given
 *
 *  recorded_game
 *    .input : list of every move played in a given game
 *    .seed : seed used to create the given game
 *
 */

class Game_replay {
  constructor(recorded_game) {
    this.recorded_game = { ...recorded_game };
    this.game = new Game(recorded_game.seed);
  }
}