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
    slide: { //optional, if the cell should be shown as sliding
      direction, //<"up"|"down"|"left"|"right">
      distance   //1-3 },
  }
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
  + (number.slide ? `slide-${number.slide.direction}-${number.slide.distance} sliding` : "");
  return (<div className={ classNames } key={ number.id }> </div>);
}

export const Ten24Board = () => {
  const [numbersInPlay, setNumbersInPlay] = useState([]);
  const [nID, setID] = useState(0);

  let placeNumberFake = () => {
    placeNumber(0, 0, 2);
    placeNumber(1, 1, 2);
    placeNumber(2, 2, 2);
    placeNumber(3, 3, 2);
  }

  let slideNumberFake = () => {
    let pos = (row, col) => ({ row: row, column: col })
    let to = (dist, dir) => ({ distance: dist, direction: dir })
    slideNumber(pos(0, 0), to(3, "right"));
    slideNumber(pos(1, 1), to(2, "right"));
    slideNumber(pos(2, 2), to(1, "right"));
  }

  let placeNumber = (row, column, value) => {
    let number = {
      position: {
        row,
        column
      },
      slide: null,
      value,
      id: nID
    }

//    setNumbersInPlay([...numbersInPlay, number]);
    numbersInPlay.push(number);//needs a re-render
    setID(nID + 1);
  }

  /* from = { row, column }
     to = { distance, direction }
   */
  let slideNumber = (from, to) => {
    let numberFrom = (n) => (n.position.column == from.column &&
                             n.position.row == from.row &&
                             n.slide == null)
    let n = numbersInPlay.find(numberFrom);

    if (!n) return;
    n.slide = { ...to };

    //setNumbersInPlay([...numbersInPlay]);//if this line is commented you need to force re-render
    setID(nID + 1);//only used to force a re-render.
  }

  let combineNumbers = () => {
  }
  let lilhelper = { column: 1, row: 1}
  return (
    <div className="ten24-board">
      <button onClick={ e => { placeNumberFake() } }>placeNumberFake</button>
      <button onClick={ e => { slideNumberFake() } }>slideNumberFake</button>
      <button onClick={ e => { slideNumber(lilhelper, { direction: "up", distance: 1 }) } }>up</button>
      <button onClick={ e => { slideNumber(lilhelper, { direction: "down", distance: 1 }) } }>down</button>
      <button onClick={ e => { slideNumber(lilhelper, { direction: "left", distance: 1 }) } }>left</button>
      <button onClick={ e => { slideNumber(lilhelper, { direction: "right", distance: 1 }) } }>right</button>
      <div className="ten24-board-background-layer">
      </div>
      <div className="ten24-board-empty-cell-layer ten24-board-layer">
        { fillWithEmptyCells() }
      </div>
      <div className="ten24-board-numbers-layer ten24-board-layer">
        { numbersInPlay.map(renderNumber) }
      </div>
    </div>
  )
}