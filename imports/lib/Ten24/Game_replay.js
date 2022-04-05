import { Game } from './Ten24.js';
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
 *    - rewind() // reset the game and replay
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

export class Game_replay {
  constructor(recorded_game) {
    this.recorded_game = { ...recorded_game };
    this.movement_counter = 0;
    this.game = new Game(recorded_game.seed);
  }
  /** @@iterator
   * Enable javascript iteration.
   * See Iteration protocols for ECMAscript 2015
   */
  [Symbol.iterator]() {
    return this;
  }
  /** next
   * Play the recorded game, move by move.
   * Consumes one move from `this.recorded_game.input`,
   *   even if it does not result in an actual game move.
   * 
   * Returns: as defined in `Symbol.iterator`, an object like { done(), value }
   *            to be used by the @@iterator
   */
  next() {
    if (this.done())
      return { done: true };

    let move = this.recorded_game.input[this.movement_counter];
    this.movement_counter++;

    return {
      done: false,
      value: this.game.move(move)
    }
  }

  /** done
   * Returns whether or not there are no more moves to process
   */
  done() {
    return this.movement_counter >= this.recorded_game.input.length;
  }


  rewind() {
    this.movement_counter = 0;
    this.game = new Game(recorded_game.seed);
    return false;
  }

  // plays the current game until all input is consumed.
  play() {
    for (let x of this) {/**/}
  }

  // like play(), but additionally tells you if
  //   the replay results in the given score.
  validate(target_score) {
    this.play();
    return this.game.get_score() == target_score;
  }

}
