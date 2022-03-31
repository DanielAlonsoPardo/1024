
import { assert } from 'chai';


import Ten24 from './Ten24.js';

export const UnitTests = () => {
  describe("Ten24 tests", function () {
    it("true is true", function () {
      assert.strictEqual(true, true);
    });

    describe("Engine tests", function () {
      it("New board is the right size", function() {
        const boardsize = 4;
        let engine = new Ten24.Engine(4, 0);

        let cellcount = 0;

        for (const col of engine.board) {
          for (const cell of col) {
            cellcount += 1;
            assert.strictEqual(cell, 0, "Board not correctly initialized");
          }
        }

        assert.strictEqual(cellcount, boardsize**2, "Board is not the expected size");
      });
    });
  });
}
