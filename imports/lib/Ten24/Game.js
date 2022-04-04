import { Engine } from './Engine.js'
/**  Methods:
 *    - restart(seed)
 *    - move_<up|down|left|right>() => boolean
 *    - game_ended() => boolean
 *    - get_game_record() => recorded_game
 *
 *  Attributes:
 *    - engine
 *
 */
export class Game {
  static Default_boardsize = 4;
  static Move_code = {
    Up: 'u',
    Down: 'd',
    Left: 'l',
    Right: 'r'
  };

  constructor(seed) {
    this.game_record = [];
    this.engine = new Engine(Game.Default_boardsize, seed);
    //gotta put something on the board so the game can start
    this.engine.place_2_4();
  }

  /**
   * Retrieves a list of every move performed so far.
   *   given at game start.
   */
  get_recorded_game() {
    return [...this.game_record];
  };

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
    let res;
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
    if (res)
      this.game_record.push(Move_code);
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