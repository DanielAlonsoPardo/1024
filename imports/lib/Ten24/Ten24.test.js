
import { assert } from 'chai';


import Ten24 from './Ten24.js';

export const UnitTests = () => {
  describe("Ten24 tests", function () {
    it("true is true", function () {
      assert.strictEqual(true, true);
    });

    describe("Engine tests", function () {
      it("new board is the right size", function() {
        const boardsize = 4;
        let engine = new Ten24.Engine(4, 0);

        let cellcount = 0;

        for (const col of engine.board) {
          for (const cell of col) {
            cellcount += 1;
            assert.strictEqual(cell, 0, "board not correctly initialized");
          }
        }

        assert.strictEqual(cellcount, boardsize**2, "Board is not the expected size");
      });

      describe("slide_numbers", function() {
        const boardsize = 4;
        let engine;
        beforeEach(function() {
          engine = new Ten24.Engine(boardsize, 0);
        });

        it("slides to the right", function() {
          engine = new Ten24.Engine(4, 0);
          engine.board[1][1] = 1;
          engine.slide_numbers();
          /* [ ][ ][ ][ ] ->  [ ][ ][ ][ ]
           * [ ][1][ ][ ] ->  [ ][>][ ][1]
           * [ ][ ][ ][ ] ->  [ ][ ][ ][ ]
           * [ ][ ][ ][ ] ->  [ ][ ][ ][ ]
           */

          assert.equal(engine.board[1][1], 0, "number stayed in place");

        });
      });
    });
  });
}
