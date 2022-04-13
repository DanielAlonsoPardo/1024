import { assert } from 'chai';

import { Ten24Board } from './Ten24Board.jsx';

function compareNumberInfo(n1, n2) {
  return n1.value           == n2.value &&
         n1.position.row    == n2.position.row &&
         n1.position.column == n2.position.column;
}

export const UnitTests = function() {
  describe("Ten24Board tests", function() {
    describe("hooks", function() {
      describe("callback_on_place", function() {
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
          board.callback_on_place(numberInfo);
          let found = board.numbersInPlay.filter(n => compareNumberInfo(n, numberInfo));
          assert.isNotEmpty(found, "number was not placed on the board");
        });
      });
      describe("callback_on_slide", function() {
        let board;
        beforeEach(function() {
          board = new Ten24Board();
          board.setState = () => {};
        });
        it("moves a number around", function() {
          let found;
          let topLeft = { value: 4, position: { column: 0, row: 0 } };
          let topRight = { value: 4, position: { column: 3, row: 0 } };
          let bottomRight = { value: 4, position: { column: 3, row: 3 } };
          let bottomLeft = { value: 4, position: { column: 0, row: 3 } };
          let slideRight = { from: topLeft.position.column, to: topRight.position.column,
                             slideAwayFromStart: true, slideVertically: false };
          let slideDown  = { from: topRight.position.row, to: bottomRight.position.row,
                             slideAwayFromStart: true, slideVertically: true };
          let slideLeft  = { from: bottomRight.position.column, to: bottomLeft.position.column,
                             slideAwayFromStart: false, slideVertically: false };
          let slideUp    = { from: bottomLeft.position.row, to: topLeft.position.row,
                             slideAwayFromStart: false, slideVertically: true };
          board.callback_on_place(topLeft);
          found = board.numbersInPlay.filter(n => compareNumberInfo(n, topLeft));
          assert.isAbove(found.length, 0, 'test did not initialize');

          //slide to the right
//          for (let n of board.numbersInPlay)
//            console.log(n)
          board.callback_on_slide(topLeft, topRight, slideRight);
          assert.deepInclude(board.numbersInPlay[0], { position: { ...topRight.position },
            slide: { distance: 3, direction: "r" } }, 'number did not slide right');
          //slide down
          board.callback_on_slide(topRight, bottomRight, slideDown);
          assert.deepInclude(board.numbersInPlay[0], { position: { ...bottomRight.position },
            slide: { distance: 3, direction: "d" } }, 'number did not slide down');
          //slide to the left
          board.callback_on_slide(bottomRight, bottomLeft, slideLeft);
          assert.deepInclude(board.numbersInPlay[0], { position: { ...bottomLeft.position },
            slide: { distance: 3, direction: "l" } }, 'number did not slide left');
          //slide up
          board.callback_on_slide(bottomLeft, topLeft, slideUp);
          assert.deepInclude(board.numbersInPlay[0], { position: { ...topLeft.position },
            slide: { distance: 3, direction: "u" } }, 'number did not slide up');
        });
      });
    });
  });
}