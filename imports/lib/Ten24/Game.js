import { Engine } from './Engine.js'
/** Methods:
 *    - restart(seed)
 *    - move_<up|down|left|right>() => boolean
 *    - ended() => boolean
 *    - get_record() => recorded_game
 *    - get_score() => score
 *
 *  Attributes:
 *    - engine
 */
export class Game {
  static Default_boardsize = 4;
  static Move_code = {
    Up: 'u',
    Down: 'd',
    Left: 'l',
    Right: 'r'
  };

  /** translate_slideInfo(slideInfo) => Move_code
   *  Converts a slideDir into more easily usable numberInfos and direction code
   *
   *    slideInfo -> See `slideInfo` in Engine.js
   *
   *    Returns:
   *      A `Ten24.Game.Move_code` direction
  **/
  static translate_slideInfo(slideInfo) {
    if (slideInfo.slideAwayFromStart && slideInfo.slideVertically)
      return Game.Move_code.Down;
    else if (slideInfo.slideAwayFromStart && !slideInfo.slideVertically)
      return Game.Move_code.Right;
    else if (!slideInfo.slideAwayFromStart && slideInfo.slideVertically)
      return Game.Move_code.Up;
    else if (!slideInfo.slideAwayFromStart && !slideInfo.slideVertically)
      return Game.Move_code.Left;
  }

  /**
   *     seed -> optional. converted to 32 bit unsigned by Engine.
   *     callbacks = {
   *       on_slide
   *       on_combine
   *       on_place
   *     }
   */
  //
  constructor(seed, callbacks) {
    this.callbacks = callbacks;
    this.restart(seed);
  }
  restart(seed) {
    this.game_record = [];
    this.engine = new Engine(Game.Default_boardsize, seed, this.callbacks);
    this.started = false;
  }

  start() {
    //gotta put something on the board so the game can start
    if (!this.started) {
      this.engine.place_2_4();
      this.started = true;
    }
  }

  /**
   * Checks to see if the game has ended, that is to say,
   *   if there are no more legal moves left.
   */
  ended() {
    return !this.engine.moves_available();
  }

  /**
   * Retrieves a list of every move performed so far.
   */
  get_record() {
    return {
      input: [...this.game_record],
      seed: this.engine.seed
    }
  };

  get_score() {
    return this.engine.score;
  }

  /** move
   *  Performs one game turn. A game turn has the following phases:
   *    - First, slide all numbers in a valid direction.
   *        For a direction to be valid, it must result in at least one number sliding or combining.
   *        If the direction given is not valid, the move is aborted.
   *    - Second, place one number randomly on the board.
   *        The value of this new number must be either 2 or 4,
   *          randomly chosen. 4s should be less frequent.
   *  If the move is legal, it is put into the game record. Otherwise, it is ignored.
   *
   *  Returns: true if the move was performed, false otherwise.
   */
  move(Move_code) {
    if (!this.started)
      return;
    let res = false;
    switch(Move_code) {
      case Game.Move_code.Up:
        res = this.engine.slide_numbers_raw(false, true);
        break;
      case Game.Move_code.Down:
        res = this.engine.slide_numbers_raw(true, true);
        break;
      case Game.Move_code.Left:
        res = this.engine.slide_numbers_raw(false, false);
        break;
      case Game.Move_code.Right:
        res = this.engine.slide_numbers_raw(true, false);
        break;
      default:
        throw 'In Game.move(): given Move_code (' + Move_code + ') is not a valid direction'
    }
    if (res) {
      this.game_record.push(Move_code);
      this.engine.place_2_4();
    }
    return res;
  }
  /*syntax sugar*/
  move_up() {
    return this.move(Game.Move_code.Up);
  }
  move_down() {
    return this.move(Game.Move_code.Down);
  }
  move_left() {
    return this.move(Game.Move_code.Left);
  }
  move_right() {
    return this.move(Game.Move_code.Right);
  }

}