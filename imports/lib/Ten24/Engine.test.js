import { assert } from 'chai';

import { Engine } from './Engine.js'

export const UnitTests = () => {
  describe("Engine tests", function () {
    it("new board is correctly constructed", function() {
      const boardsize = 4;
      let engine = new Engine(4, 0);

      let cellcount = 0;

      for (const col of engine.board) {
        for (const cell of col) {
          cellcount += 1;
          assert.strictEqual(cell, 0, "board not correctly initialized");
        }
      }

      assert.strictEqual(cellcount, boardsize**2, "Board is not the expected size");
    });

    describe("slide_numbers_raw", function() {
      const boardsize = 4;
      let engine;
      beforeEach(function() {
        engine = new Engine(boardsize, 0);
      });



      it("slides to the right", function() {
        engine = new Engine(4, 0);
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
        engine = new Engine(4, 0);
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
        engine = new Engine(4, 0);
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
        engine = new Engine(4, 0);
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
    describe("place_randomly", function() {
      it("places a number whenever it can", function() {
        let boardsize = 4;
        let engine = new Engine(boardsize, 0);
        let i;
        for (i = 0; i < boardsize**2; i++) {
          let before = engine.count_empty_cells();
          let ret = engine.place_randomly(2);
          let after = engine.count_empty_cells();
          assert.equal(after, before - 1, "did not correctly add number to board (loop "+i+")");
          assert.isTrue(ret, "unexpected return (loop "+i+")")
        }

        let ret = engine.place_randomly(1);
        assert.isFalse(ret, "expected place_randomly to return false (aka 'didnt place number')(loop "+i+")")
      });
    });
    describe("attribute updating", function() {
      let boardsize = 4;
      let engine;
      beforeEach(function() {
        engine = new Engine(boardsize, 0)
      });

      it("correctly updates max number after random number placement", function() {
        //new board
        assert.equal(engine.max_number, 0);
        //when adding a new number at random
        engine.place_randomly(1);
        assert.equal(engine.max_number, 1);
        engine.place_randomly(2);
        assert.equal(engine.max_number, 2);
        engine.place_randomly(1);
        assert.equal(engine.max_number, 2);
      });

      it("correctly updates max number after making a move", function() {
        for (let row = 0; row < engine.board.length; row++)
          for (let col = 0; col < engine.board.length; col++)
            engine.board[row][col] = 1;

        engine.slide_numbers_raw(true, false);
        assert.equal(engine.max_number, 2);
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.max_number, 4);
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.max_number, 4);
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.max_number, 8);
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.max_number, 16);
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.max_number, 16);

      });

      it("keeps track of zeros on board", function() {
        assert.equal(engine.zero_count, 16, "zeros not correctly initialized");
        let i = boardsize**2;
        while (i > 0) {
          i--;
          engine.place_randomly(1);
          assert.equal(engine.zero_count, i, "zeros not correctly updated after random number placement");
        }
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.zero_count, 8, "zeros not correctly updated after sliding the board");
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.zero_count, 12, "zeros not correctly updated after sliding the board");
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.zero_count, 14, "zeros not correctly updated after sliding the board");
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.zero_count, 15, "zeros not correctly updated after sliding the board");
      });
    });
  });
}