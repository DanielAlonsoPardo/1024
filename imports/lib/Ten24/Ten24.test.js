import { assert } from 'chai';

import Engine_test from './Engine.test.js'
import Game_test from './Game.test.js'

export const UnitTests = () => {
  describe("Ten24 tests", function () {
    it("true is true", function () {
      assert.strictEqual(true, true);
    });

    Engine_test.UnitTests();
    Game_test.UnitTests();
  });
}
