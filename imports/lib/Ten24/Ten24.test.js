import { assert } from 'chai';

import Engine_test from './Engine.test.js'
import Game_test from './Game.test.js'
import Game_replay_test from './Game_replay.test.js'

export const UnitTests = function() {
  describe("Ten24 tests", function () {
    it("true is true", function () {
      assert.strictEqual(true, true);
    });

    Engine_test.UnitTests();
    Game_test.UnitTests();
    Game_replay_test.UnitTests();
  });
}
