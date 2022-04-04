import { assert } from 'chai';

import { Game } from './Ten24.js';

export const UnitTests = () => {
  describe("Game", function() {
    let game;
    beforeEach(function() {
      game = new Game(0);
    });
    it("game does not start with an empty board", function() {
      assert.isBelow(game.engine.count_empty_cells(), 16, "every cell is empty");
    });
    it("records games correctly", function() {
      try {
        let expected_moves = [];
        assert.deepEqual(game.get_recorded_game(), [], "incorrect initialization");
        game.move_up();
        expected_moves.push(Game.Move_code.Up)
        game.move_down();
        expected_moves.push(Game.Move_code.Down)
        game.move_left();
        expected_moves.push(Game.Move_code.Left)
        game.move_right();
        expected_moves.push(Game.Move_code.Right)
        assert.deepEqual(game.get_recorded_game(), expected_moves, "recorded_game is corrupt");
      } catch (e) {
        game.engine.log_board();
        throw e;
      }
    });

  });
}