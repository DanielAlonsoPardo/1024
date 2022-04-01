
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
          engine.board[0] = [0, 0, 1, 1];
          engine.board[1] = [0, 1, 0, 0];
          engine.board[2] = [1, 1, 1, 1];
          engine.board[3] = [0, 1, 2, 1];

          engine.slide_numbers_raw(true, false);

          assert.equal(engine.board[1][1], 0, "number stayed in place");
          assert.equal(engine.board[1][3], 1, "number did not slide right");


          assert.deepEqual(engine.board[0], [0, 0, 0, 2], "numbers did not slide to the right");
          assert.deepEqual(engine.board[1], [0, 0, 0, 1], "numbers did not slide to the right");
          assert.deepEqual(engine.board[2], [0, 0, 2, 2], "numbers did not slide to the right");
          assert.deepEqual(engine.board[3], [0, 1, 2, 1], "numbers did not slide to the right");
        });
        it("slides to the left", function() {
          engine = new Ten24.Engine(4, 0);
          engine.board[0] = [0, 0, 1, 1];
          engine.board[1] = [0, 1, 0, 0];
          engine.board[2] = [1, 1, 1, 1];
          engine.board[3] = [0, 1, 2, 1];

          engine.slide_numbers_raw(false, false);

          assert.deepEqual(engine.board[0], [2, 0, 0, 0], "numbers did not slide to the left (row 0)");
          assert.deepEqual(engine.board[1], [1, 0, 0, 0], "numbers did not slide to the left (row 1)");
          assert.deepEqual(engine.board[2], [2, 2, 0, 0], "numbers did not slide to the left (row 2)");
          assert.deepEqual(engine.board[3], [1, 2, 1, 0], "numbers did not slide to the left (row 3)");
        });
        it("slides down", function() {
          engine = new Ten24.Engine(4, 0);
          engine.board[0] = [0, 0, 1, 1];
          engine.board[1] = [0, 1, 0, 0];
          engine.board[2] = [1, 1, 1, 1];
          engine.board[3] = [0, 1, 2, 1];

          engine.slide_numbers_raw(true, true);

          assert.deepEqual(engine.board[0], [0, 0, 0, 0], "numbers did not slide down (row 0)");
          assert.deepEqual(engine.board[1], [0, 0, 0, 0], "numbers did not slide down (row 1)");
          assert.deepEqual(engine.board[2], [0, 1, 2, 1], "numbers did not slide down (row 2)");
          assert.deepEqual(engine.board[3], [1, 2, 2, 2], "numbers did not slide down (row 3)");
        });
        it("slides up", function() {
          engine = new Ten24.Engine(4, 0);
          engine.board[0] = [0, 0, 1, 1];
          engine.board[1] = [0, 1, 0, 0];
          engine.board[2] = [1, 1, 1, 1];
          engine.board[3] = [0, 1, 2, 1];

          engine.slide_numbers_raw(false, true);

          assert.deepEqual(engine.board[0], [1, 2, 2, 2], "numbers did not slide down (row 0)");
          assert.deepEqual(engine.board[1], [0, 1, 2, 1], "numbers did not slide down (row 1)");
          assert.deepEqual(engine.board[2], [0, 0, 0, 0], "numbers did not slide down (row 2)");
          assert.deepEqual(engine.board[3], [0, 0, 0, 0], "numbers did not slide down (row 3)");
        });
      });
    });
  });
}
