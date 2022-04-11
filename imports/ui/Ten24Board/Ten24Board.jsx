import React, { useState } from 'react';

import './Ten24Board.css'


/** Ten24Board
 *
 *
 *  `number` is the structure containing all the info necessary to render
 *    a piece on the board.
 *
  number = {
    value, //preferably powers of 2 only
    id,    //its React key
    position: {
      row,
      column },
    combined, //0, if the cell was not created from being combined
             //equals to the distance of the farthest number being combined 
    slide: { //optional, if the cell should be shown as sliding
             //to be interpreted as "where this tile slid from to end up where it is"
      direction, //<"up"|"down"|"left"|"right">
      distance   //1-3 },
  }
*/

/** translate_slideDir(slideDir) => direction
  *  Converts a slideDir into a direction
  *
  *  slideDir = { slideAwayFromStart, slideVertically }
  *  //see Ten24.Engine.slide_numbers_raw()
  *
  *  direction = <"up"|"down"|"left"|"right">
  */

//background layer helper
let fillWithEmptyCells = () => {
  let divs = [];
  let id = 0;
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 4; col++)
      divs.push(<div className={ `ten24-cell ten24-col-${col} ten24-row-${row}` } key={id++}></div>);
  return divs;
}

let getSlideClass = (dir, dist) => {
  return (`${dir} ${dist}`)
}

let renderNumber = (number) => {
  let classNames = "";
  classNames = "ten24-cell "
  + `ten24-row-${number.position.row} `
  + `ten24-col-${number.position.column} `
  + (number.slide ? `slide-from-${number.slide.direction}-${number.slide.distance} sliding` : "");
  return (<div className={ classNames } key={ number.id }> { number.value } </div>);
}

export const Ten24Board = () => {
  const [numbersInPlay, setNumbersInPlay] = useState([]);
  const [tempNumbers, setTempNumbers] = useState([]);
  const [nID, setID] = useState(0);
  let ID = nID;
  const [counter, setCounter] = useState(0);

  let placeNumberFake = () => {
    placeNumber(0, 0, 2);
    placeNumber(1, 1, 2);
    placeNumber(2, 2, 2);
    placeNumber(3, 3, 2);
  }

  let placeNumberFake2 = () => {
    placeNumber(3, 0, 2);
    placeNumber(3, 0, 2);
    placeNumber(3, 0, 2);
  }
  let combineNumbersFake = () => {
    combineNumbers({row: 3, column: 0}, 33);
  }

  let slideNumberFake = () => {
    let pos = (row, col) => ({ row: row, column: col })
    let to = (dist, dir) => ({ distance: dist, direction: dir })
    slideNumber(pos(0, 0), pos(0, 3), to(3, "right"));
    slideNumber(pos(1, 1), pos(1, 3), to(2, "right"));
    slideNumber(pos(2, 2), pos(2, 3), to(1, "right"));
  }

  let placeNumber = (row, column, value, combined) => {
    let number = {
      position: {
        row,
        column
      },
      combined: combined || 0,
      slide: null,
      value,
      id: ID
    }

//    setNumbersInPlay([...numbersInPlay, number]);
    numbersInPlay.push(number);//needs a re-render
    setID(++ID);
  }

  /* from = { row, column }
     to = { row, column }
     travel = { distance, direction } // what movement the number did to go from `from` to `to`
   */
  let slideNumber = (from, to, travel) => {
    let numberFrom = (n) => (n.position.column == from.column &&
                             n.position.row == from.row &&
                             n.slide == null)
    let n = numbersInPlay.find(numberFrom);
    if (!n) return;

    n.position = to;
    n.slide = { ...travel };

    //setNumbersInPlay([...numbersInPlay]);//if this line is commented you need to force re-render
    setID(++ID);//only used to force a re-render.
  }

  // pos = { row, column }
  let combineNumbers = (pos, value) => {
    let overwritable = (number) => (number.position.row == pos.row &&
                                    number.position.column == pos.column)
    //move old to temp numbers array
    setNumbersInPlay(numbersInPlay.filter(n => !overwritable(n)));
    let to_combine = numbersInPlay.filter(overwritable);
    setTempNumbers(tempNumbers.concat(to_combine));

    //add new
    let combined = Math.max(...(to_combine.map(n => n.slide?.distance)));
    placeNumber(pos.row, pos.column, value, combined || 0);
  }
  return (
<div>
    <div className="ten24-board">
      <button onClick={ e => { placeNumberFake() } }>placeNumberFake</button>
      <button onClick={ e => { slideNumberFake() } }>slideNumberFake</button>
      <button onClick={ e => { placeNumberFake2() } }>place combine</button>
      <button onClick={ e => { combineNumbersFake() } }>test combine</button>

      <div className="ten24-board-background-layer">
      </div>
      <div className="ten24-board-empty-cell-layer ten24-board-layer">
        { fillWithEmptyCells() }
      </div>
      <div className="ten24-board-numbers-layer ten24-board-layer">
        { numbersInPlay.map(renderNumber) }
        { tempNumbers.map(renderNumber) }
      </div>
    </div>
<p>{JSON.stringify(numbersInPlay)}</p>
<p>{JSON.stringify(tempNumbers)}</p>
</div>
  )
}