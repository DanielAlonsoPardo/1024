import { assert } from 'chai';

import { Game_replay } from './Ten24.js';
import { Game } from './Ten24.js';

export const UnitTests = function() {
  describe("Game_replay tests", function() {

    let game;
    beforeEach(function() {
      game = new Game(Math.random());
      while(!game.ended()) {
        game.move_up();
        game.move_down();
        game.move_left();
        game.move_right();
      }
    });
    it("Replays a game correctly.", function() {
      let recorded_game = game.get_record()
      let replay = new Game_replay(recorded_game);

      for (let ret of replay) {
      }

      assert.deepEqual(replay.game.get_record(), recorded_game);
    });
    it("Validates real games correctly")
  });
}