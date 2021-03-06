import { default as chai, assert } from 'chai';

import { Engine } from './Engine.js'

export const UnitTests = function() {
  describe("Engine tests", function () {
    let init_board = (eng, num) => {
      while (eng.place_randomly(num)) {
        //nop
      }
          
      return eng;
    }
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
        engine.board[0] = [0, 4, 8, 4];
        engine.board[1] = [0, 1, 0, 0];
        engine.board[2] = [4, 8, 4, 0];
        engine.board[3] = [0, 1, 2, 1];

        engine.slide_numbers_raw(true, false);

        assert.equal(engine.board[1][1], 0, "number stayed in place");
        assert.equal(engine.board[1][3], 1, "number did not slide right");


        assert.deepEqual(engine.board[0], [0, 4, 8, 4], "numbers did not slide to the right");
        assert.deepEqual(engine.board[1], [0, 0, 0, 1], "numbers did not slide to the right");
        assert.deepEqual(engine.board[2], [0, 4, 8, 4], "numbers did not slide to the right");
        assert.deepEqual(engine.board[3], [0, 1, 2, 1], "numbers did not slide to the right");
      });
      it("slides to the left", function() {
        engine = new Engine(4, 0);
        engine.board[0] = [0, 0, 1, 1];
        engine.board[1] = [0, 4, 8, 4];
        engine.board[2] = [4, 8, 4, 0];
        engine.board[3] = [0, 1, 2, 1];

        engine.slide_numbers_raw(false, false);

        assert.deepEqual(engine.board[0], [2, 0, 0, 0], "numbers did not slide to the left (row 0)");
        assert.deepEqual(engine.board[1], [4, 8, 4, 0], "numbers did not slide to the left (row 1)");
        assert.deepEqual(engine.board[2], [4, 8, 4, 0], "numbers did not slide to the left (row 2)");
        assert.deepEqual(engine.board[3], [1, 2, 1, 0], "numbers did not slide to the left (row 3)");
      });
      it("slides down", function() {
        engine = new Engine(4, 0);
        engine.board[0] = [0, 0, 4, 0];
        engine.board[1] = [0, 1, 8, 4];
        engine.board[2] = [1, 1, 4, 8];
        engine.board[3] = [0, 1, 0, 4];

        engine.slide_numbers_raw(true, true);
        try {
          assert.deepEqual(engine.board[0], [0, 0, 0, 0], "numbers did not slide down (row 0)");
          assert.deepEqual(engine.board[1], [0, 0, 4, 4], "numbers did not slide down (row 1)");
          assert.deepEqual(engine.board[2], [0, 1, 8, 8], "numbers did not slide down (row 2)");
          assert.deepEqual(engine.board[3], [1, 2, 4, 4], "numbers did not slide down (row 3)");
        } catch(e) {
          engine.log_board();
          throw e;
        }
      });
      it("slides up", function() {
        engine = new Engine(4, 0);
        engine.board[0] = [0, 0, 0, 4];
        engine.board[1] = [0, 1, 4, 8];
        engine.board[2] = [1, 1, 8, 4];
        engine.board[3] = [0, 1, 4, 0];

        engine.slide_numbers_raw(false, true);

        assert.deepEqual(engine.board[0], [1, 2, 4, 4], "numbers did not slide down (row 0)");
        assert.deepEqual(engine.board[1], [0, 1, 8, 8], "numbers did not slide down (row 1)");
        assert.deepEqual(engine.board[2], [0, 0, 4, 4], "numbers did not slide down (row 2)");
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
        assert.equal(engine.game_state.max_number, 0);
        //when adding a new number at random
        engine.place_randomly(1);
        assert.equal(engine.game_state.max_number, 1);
        engine.place_randomly(2);
        assert.equal(engine.game_state.max_number, 2);
        engine.place_randomly(1);
        assert.equal(engine.game_state.max_number, 2);
      });

      it("correctly updates max number after making a move", function() {
        for (let row = 0; row < engine.board.length; row++)
          for (let col = 0; col < engine.board.length; col++)
            engine.board[row][col] = 1;

        engine.slide_numbers_raw(true, false);
        assert.equal(engine.game_state.max_number, 2);
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.game_state.max_number, 4);
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.game_state.max_number, 4);
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.game_state.max_number, 8);
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.game_state.max_number, 16);
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.game_state.max_number, 16);

      });

      it("keeps track of zeros on board", function() {
        assert.equal(engine.game_state.zero_count, 16, "zeros not correctly initialized");
        let i = boardsize**2;
        while (i > 0) {
          i--;
          engine.place_randomly(1);
          assert.equal(engine.game_state.zero_count, i, "zeros not correctly updated after random number placement");
        }
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.game_state.zero_count, 8, "zeros not correctly updated after sliding the board");
        engine.slide_numbers_raw(true, true);
        assert.equal(engine.game_state.zero_count, 12, "zeros not correctly updated after sliding the board");
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.game_state.zero_count, 14, "zeros not correctly updated after sliding the board");
        engine.slide_numbers_raw(true, false);
        assert.equal(engine.game_state.zero_count, 15, "zeros not correctly updated after sliding the board");
      });
      it("keeps track of the turn count", function() {
        let i = 0;
        assert.isFalse(engine.slide_numbers_raw(true, false));
        assert.isFalse(engine.slide_numbers_raw(true, true));
        assert.isFalse(engine.slide_numbers_raw(false, false));
        assert.isFalse(engine.slide_numbers_raw(false, true));
        assert.equal(engine.game_state.move_count, 0);

        while (i < boardsize**2) {
          engine.place_randomly(1);
          i++;
        }

        assert.isTrue(engine.slide_numbers_raw(true, true));
        assert.isTrue(engine.slide_numbers_raw(true, true));
        assert.isFalse(engine.slide_numbers_raw(true, true));
        assert.isTrue(engine.slide_numbers_raw(true, false));
        assert.isTrue(engine.slide_numbers_raw(true, false));
        assert.isFalse(engine.slide_numbers_raw(true, false));
        assert.equal(engine.game_state.move_count, 4);

      });
      it("updates score correctly", function() {
        try {
          init_board(engine, 1);
          assert.equal(engine.game_state.score, 0, "expected score to be 0");
          engine.slide_numbers_raw(true, true);
          assert.equal(engine.game_state.score, 16, "expected score to be 16");
          engine.slide_numbers_raw(true, true);
          assert.equal(engine.game_state.score, 32, "expected score to be 32");
          engine.slide_numbers_raw(true, false);
          assert.equal(engine.game_state.score, 48, "expected score to be 48");
          engine.slide_numbers_raw(true, false);
          assert.equal(engine.game_state.score, 64, "expected score to be 64");
        } catch (e) {
          engine.log_board();
          throw e;
        }
      });
    });
    describe("moves_available", function() {
      let boardsize = 4;
      let engine;
      beforeEach(function() {
        engine = new Engine(boardsize, 0)
      });

      it("correctly finds game end", function() {
        assert.isTrue(engine.moves_available());
        for (let row = 0, even = true; row < boardsize; row ++) {
          for (let col = 0; col < boardsize; col ++) {
            engine.board[row][col] = even ? 1 : 2;
            even = !even;
          }
          even = !even;
        }
        engine.game_state.zero_count = 0;
        assert.isFalse(engine.moves_available());
      });
    });

    describe("hooks", function() {
      let boardsize = 4;
      let engine;
      beforeEach(function() {
        engine = new Engine(boardsize, 0)
      });

      it("calls on_slide", function() {
        let executed = 0;
        let args;
        let f = (fromInfo, toInfo, slideInfo) => {
          executed++;
          args = { fromInfo, toInfo, slideInfo };
        };

        engine.board[1][1] = 333;
        engine.update_game_state();
        engine.on_slide(f)
        engine.slide_numbers_raw(true, false); //slide right
        let expected_args = {
          fromInfo: {
            value: 333,
            position: {
              row: 1,
              column: 1 } },
          toInfo: {
            value: 0,
            position: {
              row: 1,
              column: 3 } },
          slideInfo: {
            from: 1,
            to: 3,
            slideAwayFromStart: true,
            slideVertically: false } }

        assert.equal(executed, 1, "did not execute callback");
        assert.deepEqual(args, expected_args, "Incorrect arguments passed to on_slide callback when sliding right");

        //check if combines are correctly generating slide events
        executed = 0;
        engine.slide_numbers_raw(false, false); //slide left
        expected_args.fromInfo = expected_args.toInfo;
        expected_args.fromInfo.value = 333;
        expected_args.toInfo = { value: 0, position: { row: 1, column: 0 } };
        expected_args.slideInfo = { from: 3, to: 0, slideAwayFromStart: false, slideVertically: false };

        assert.equal(executed, 1, "did not execute all callbacks");
        assert.deepEqual(args, expected_args, "Incorrect arguments passed to on_slide callback when sliding left");

        executed = 0;
        engine.slide_numbers_raw(true, true); //slide down
        expected_args.fromInfo = expected_args.toInfo;
        expected_args.fromInfo.value = 333;
        expected_args.toInfo = { value: 0, position: { row: 3, column: 0 } };
        expected_args.slideInfo = { from: 1, to: 3, slideAwayFromStart: true, slideVertically: true };

        assert.equal(executed, 1, "did not execute all callbacks");
        assert.deepEqual(args, expected_args, "Incorrect arguments passed to on_slide callback when sliding left");
      });

      it("on_slide fires during secondary slides", function() {
        engine.board[0] = [8, 2, 0, 0];
        engine.board[1] = [4, 0, 2, 0];
        engine.board[2] = [0, 0, 0, 0];
        engine.board[3] = [2, 0, 0, 0];
        engine.update_game_state();

        let expected_args = {
          fromInfo: {
            value: 2,
            position: {
              row: 1,
              column: 2 } },
          toInfo: {
            value: 0,
            position: {
              row: 1,
              column: 1 } },
          slideInfo: {
            from: 2,
            to: 1,
            slideAwayFromStart: false,
            slideVertically: false } };
        let args;
        let f = (fromInfo, toInfo, slideInfo) => {
          args = { fromInfo, toInfo, slideInfo };
        };
        engine.on_slide(f);
        engine.slide_numbers_raw(false, false, true); //slide left
        assert.deepEqual(args, expected_args);
      })

      it("calls on_combine", function() {
        let executed = false;
        let args;
        let f = (combinedNumberInfo) => {
          executed = true;
          args = { combinedNumberInfo };
        };

        engine.on_combine(f);
        engine.board[1][1] = 333;
        engine.board[2][2] = 333;
        engine.update_game_state();
        engine.on_combine(f)
        engine.slide_numbers_raw(true, false); //slide right
        engine.slide_numbers_raw(true, true); //slide down and combine

        assert.isTrue(executed, "did not execute callback");
        assert.exists(args?.combinedNumberInfo, "gets parameters");
        assert.equal(args.combinedNumberInfo?.position?.row, 3, "Incorrect number row position");
        assert.equal(args.combinedNumberInfo?.position?.column, 3, "Incorrect number column position");
        assert.equal(args.combinedNumberInfo?.value, 333*2, "Incorrect number value");
      });

      it("calls on_place", function() {
        let executed = false;
        let f = params => { executed = true };
        engine.on_place(f);
        engine.place_2_4(f);
        assert.isTrue(executed, "did not execute callback 1");

        executed = false;
        paramsExist = false;
        paramsOK = false;
        f = params => {
          executed = true;
          if (params)
            paramsExist = true;
          if (params?.value &&
              params?.position?.column &&
              params?.position?.row)
            paramsOK = true;
        };
        engine.on_place(f);
        engine.place_2_4(f);
        assert.isTrue(executed, "did not execute callback 2");
        assert.isTrue(paramsExist, "did not pass parameters to the callback");
        assert.isTrue(paramsOK, "did not pass the correct parameters to the callback");
      });
    });
  });
}