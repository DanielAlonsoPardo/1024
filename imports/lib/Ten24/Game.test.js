import { assert } from 'chai';

import { Game, Record } from './Game.js';
import { Dummies } from './testing.js';
import SimpleSchema from 'simpl-schema';

export const UnitTests = function() {
  describe("Game", function() {
    let game;
    beforeEach(function() {
      game = new Game(0);
    });
    it("game starts with an empty board", function() {
      assert.equal(game.engine.count_empty_cells(), 16, "not every cell is empty");
    });
    it("records games correctly", function() {
      try {
        let expected_moves = [];
        assert.deepEqual(game.get_record().input, [], "incorrect initialization");
        if (game.move_up())
          expected_moves.push(Game.Move_code.Up)
        if (game.move_down())
          expected_moves.push(Game.Move_code.Down)
        if (game.move_left())
          expected_moves.push(Game.Move_code.Left)
        if (game.move_right())
          expected_moves.push(Game.Move_code.Right)
        assert.deepEqual(game.get_record().input, expected_moves, "recorded_game is corrupt");
      } catch (e) {
        game.engine.log_board();
        throw e;
      }
    });
    describe("Record schema", function() {
      const Schema = Record.Schema;
      let validRecord = Dummies.Game.full_game;

      it("validates correctly", function() {
        assert.throws(_ => Schema.validate({}), undefined, undefined, "does not reject empty object");
        assert.doesNotThrow(_ => Schema.validate(validRecord), undefined, undefined, "rejects valid object");
        let floatingPointSeed = {...validRecord};
        floatingPointSeed.seed = 0.5;
        assert.throws(_ => Schema.validate(floatingPointSeed), undefined, undefined, "does not reject decimals in seed");
      });
    })

  });
}