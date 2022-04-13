import { assert } from 'chai';

import { Ten24Board } from './Ten24Board.jsx';
import { Game } from '/imports/lib/Ten24/Game.js'

function compareNumberInfo(n1, n2) {
  return n1.value           == n2.value &&
         n1.position.row    == n2.position.row &&
         n1.position.column == n2.position.column;
}

export const UnitTests = function() {
  describe("Ten24Board tests", function() {
    describe("number movement", function() {
      describe("placeNumber", function() {
        let board;
        beforeEach(function() {
          board = new Ten24Board();
          board.setState = () => {};
        });
        it("puts in a new number into numbersInPlay", function() {
          let numberInfo = {
            value: 4,
            position: { column: 1, row: 2 }
          };
          let expectedNumber = {
            value: 4,
            position: {
              column: 1,
              row: 2
            },
            combined: 0,
            slide: null
          }

          board.placeNumber(numberInfo.position.row, numberInfo.position.column, numberInfo.value);
          assert.exists(board.numbersInPlay[0], "number was not placed on the board");
          assert.deepInclude(board.numbersInPlay[0], expectedNumber, "incorrect number was placed");
        });
      });
      describe("slideNumber", function() {
        let board;
        beforeEach(function() {
          board = new Ten24Board();
          board.setState = () => {};
        });
        it("moves a number around", function() {
          let found;
          let topLeft = { column: 0, row: 0 };
          let topRight = { column: 3, row: 0 };
          let bottomRight = { column: 3, row: 3 };
          let bottomLeft = { column: 0, row: 3 };

          let travelRight = { distance: 3, direction: Game.Move_code.Right };
          let travelDown  = { distance: 3, direction: Game.Move_code.Down };
          let travelLeft  = { distance: 3, direction: Game.Move_code.Left };
          let travelUp    = { distance: 3, direction: Game.Move_code.Up };

          board.placeNumber(topLeft.row, topLeft.column, 128);
          assert.lengthOf(board.numbersInPlay, 1, 'test did not initialize');

          //slide to the right
          board.slideNumber(topLeft, topRight, travelRight)
          assert.deepInclude(board.numbersInPlay[0], { position: topRight }, 'number did not slide right');

          //slide to the bottom
          board.slideNumber(topRight, bottomRight, travelDown)
          assert.deepInclude(board.numbersInPlay[0], { position: bottomRight }, 'number did not slide right');

          //slide to the left
          board.slideNumber(bottomRight, bottomLeft, travelLeft)
          assert.deepInclude(board.numbersInPlay[0], { position: bottomLeft }, 'number did not slide right');

          //slide to the top
          board.slideNumber(bottomLeft, topLeft, travelUp)
          assert.deepInclude(board.numbersInPlay[0], { position: topLeft }, 'number did not slide right');


        });
      });
      describe("onCombine", function() {
        let board;
        beforeEach(function() {
          board = new Ten24Board();
          board.setState = () => {};
        });
        it("moves a number around", function() {
          let found;
          let topLeft = { value: 4, position: { column: 0, row: 0 } };
          let combined = { value: 8, position: { ...topLeft.position } };

          board.placeNumber(topLeft.position.row, topLeft.position.column, 128);
          board.placeNumber(topLeft.position.row, topLeft.position.column, 128);
          assert.lengthOf(board.numbersInPlay, 2, 'test did not initialize');
          assert.lengthOf(board.tempNumbers, 0, 'test did not initialize 2');

          board.combineNumbers(combined.position, combined.value);
          assert.lengthOf(board.numbersInPlay, 1, 'did not remove old numbers and place new combined');
          assert.lengthOf(board.tempNumbers, 2, 'did not move old numbers to temp array');
        });
      });
    });
  });
}