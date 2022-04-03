import { assert } from 'chai';

import Ten24 from './Ten24.js';

import Engine_test from './Engine.test.js'

export const UnitTests = () => {
  describe("Ten24 tests", function () {
    it("true is true", function () {
      assert.strictEqual(true, true);
    });

    Engine_test.UnitTests();
  });
}
