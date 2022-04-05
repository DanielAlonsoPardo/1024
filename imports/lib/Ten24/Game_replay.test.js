import { assert } from 'chai';

import { Game_replay } from './Ten24.js';
import { Game } from './Ten24.js';

export const UnitTests = function() {
  describe("Game_replay tests", function() {

    let game;
    let replay;
    beforeEach(function() {
      game = new Game(Math.random());
      while(!game.ended()) {
        game.move_up();
        game.move_down();
        game.move_left();
        game.move_right();
      }
      replay = new Game_replay(game.get_record());
    });
    it("Replays a game correctly.", function() {
      replay.play();

      assert.deepEqual(replay.game.get_record(), game.get_record());
    });
    it("Iterates correctly.", function() {
      for (let ret of replay) {/**/}

      assert.deepEqual(replay.game.get_record(), game.get_record());
    });
    it("Validates real games correctly", function() {
      let res = replay.validate(game.get_score());
      assert.isTrue(res, "fails to validate normal game");
    });
  });
}