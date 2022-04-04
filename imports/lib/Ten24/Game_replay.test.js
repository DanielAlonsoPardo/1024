import { assert } from 'chai';

import { Game_replay } from './Ten24.js';
import { Game } from './Ten24.js';

export const UnitTests = function() {
  describe("Game_replay tests", function() {

    let game;
    beforeEach(function() {
      game = new Game(0);
    });
    it.skip("Replays a game correctly.", function() {
      while(!game.ended()) {
        game.move_up();
              game.engine.log_board();
              console.log(game.engine.game_state);
        game.move_down();
              game.engine.log_board();
              console.log(game.engine.game_state);
        game.move_left();
              game.engine.log_board();
              console.log(game.engine.game_state);
        game.move_right();
              game.engine.log_board();
              console.log(game.engine.game_state);
      }

      let replay = new Game_replay(game.get_record());
//      game.engine.log_board();
//      replay.game.engine.log_board();

//      for (let ret of replay) {
//        replay.game.engine.log_board();
//      }

    });
  });
}