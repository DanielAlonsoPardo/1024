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

          let expectedNumber = {
            value: 8,
            position: topLeft,
            combined: 0,
            slide: null
          }

          board.placeNumber(expectedNumber.position.row, expectedNumber.position.column, expectedNumber.value);
          assert.lengthOf(board.numbersInPlay, 1, 'test did not initialize');

          //slide to the right
          board.slideNumber(topLeft, topRight, travelRight)
          expectedNumber.position = topRight;
          expectedNumber.slide = travelRight;
          assert.deepInclude(board.numbersInPlay[0], expectedNumber, 'number did not slide right');


          //slide to the bottom
          board.slideNumber(topRight, bottomRight, travelDown)
          expectedNumber.position = bottomRight;
          expectedNumber.slide = travelDown;
          assert.deepInclude(board.numbersInPlay[0], expectedNumber, 'number did not slide right');

          //slide to the left
          board.slideNumber(bottomRight, bottomLeft, travelLeft)
          expectedNumber.position = bottomLeft;
          expectedNumber.slide = travelLeft;
          assert.deepInclude(board.numbersInPlay[0], expectedNumber, 'number did not slide right');

          //slide to the top
          board.slideNumber(bottomLeft, topLeft, travelUp)
          expectedNumber.position = topLeft;
          expectedNumber.slide = travelUp;
          assert.deepInclude(board.numbersInPlay[0], expectedNumber, 'number did not slide right');


        });
      });
      describe("combineNumber", function() {
        let board;
        beforeEach(function() {
          board = new Ten24Board();
          board.setState = () => {};
        });
        it("moves a number around", function() {
          let found;
          let topLeft = { value: 4, position: { column: 0, row: 0 } };
          let topRight = { value: 4, position: { column: 3, row: 0 } };
          let combined = { value: 8, position: { ...topLeft.position } };
          let travelLeft  = { distance: 3, direction: Game.Move_code.Left };

          let expectedNumber = {
            value: 8,
            position: topLeft.position,
            combined: 3,
            slide: null
          }
          board.placeNumber(topLeft.position.row, topLeft.position.column, topLeft.value);
          board.placeNumber(topRight.position.row, topRight.position.column, topRight.value);
          assert.lengthOf(board.numbersInPlay, 2, 'test did not initialize');
          assert.lengthOf(board.tempNumbers, 0, 'test did not initialize 2');

          //slide to the left
          board.slideNumber(topRight.position, topLeft.position, travelLeft);
          board.combineNumbers(combined.position, combined.value);
          assert.lengthOf(board.numbersInPlay, 1, 'did not remove old numbers and place new combined');
          assert.lengthOf(board.tempNumbers, 2, 'did not move old numbers to temp array');
          assert.deepInclude(board.numbersInPlay[0], expectedNumber);

          board.placeNumber(expectedNumber.position.row, expectedNumber.position.column, expectedNumber.value);
          board.combineNumbers(expectedNumber.position, expectedNumber.value * 2);
          let all_good = board.tempNumbers.reduce((acc, n) => acc && n.combined == 0 , true);
          assert.isTrue(all_good, "resets `combined` value on numbers moved to tempNumbers");
        });
      });
    });
  });
}