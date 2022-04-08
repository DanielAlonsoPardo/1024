import React, { useState } from 'react';

import './Ten24Board.css'
let fillBoardWithCells = (className) => {
  let divs = [];
  let id = 0;
  for (let row = 0; row < 4; row++)
    for (let col = 0; col < 4; col++)
      divs.push(<div className={ `${className} ten24-col-${col} ten24-row-${row}` } key={id++}></div>);
  return divs;
}

export const Ten24Board = () => {
  const [numbersInPlay, setNumbersInPlay] = useState([]);
  const [nID, setID] = useState(0);

/*
  let number = {
    position: {
      row,
      column
    },
    slide_to: {
      row,
      column
    },
    value,
    id
  }
*/
  const example_number = {
    position: { row: 1,
                column: 1 },
//    slide_to: { row: 2,
//                column: 2 },
    value: 2,
    id: 1,
    inPlay: true
  }
  let renderNumber = (number) => {
    let classNames = "";
    classNames = "ten24-cell "
               + `ten24-row-${number.position.row} `
               + `ten24-col-${number.position.column} `
               + (number.slide_to ? "slide" : "");
    return (<div className={ classNames } key={ number.id }> </div>);
  }

  let placeNumberFake = () => {
    placeNumber(1, 1, 2);
  }
  let slideNumberFake = () => {
    slideNumber({ row: 1, column: 1 }, { row: 2, column: 2 });
  }

  let placeNumber = (row, column, value) => {
    let number = {
      position: {
        row,
        column
      },
      slide_to: null,
      value,
      id: nID
    }

//    setNumbersInPlay([...numbersInPlay, number]);
    numbersInPlay.push(number);//needs a re-render
    setID(nID + 1);
  }

  /* from = to = { row, column }
   */
  let slideNumber = (from, to) => {
    let numberFrom = (n) => (n.position.column == from.column &&
                             n.position.row == from.row &&
                             n.slide_to == null)
    let n = numbersInPlay.find(numberFrom);
    if (!n) return;
    n.slide_to = { ...to };

    //setNumbersInPlay([...numbersInPlay]);//if this line is commented you need to force re-render
    setID(nID + 1);//only used to force a re-render.
  }

  let combineNumbers = () => {
  }

  return (
    <div className="ten24-board">
      <button onClick={ e => { placeNumberFake() } }>placeNumberFake</button>
      <button onClick={ e => { slideNumberFake() } }>slideNumberFake</button>
      <div className="ten24-board-background-layer">
      </div>
      <div className="ten24-board-empty-cell-layer ten24-board-layer">
        { fillBoardWithCells("ten24-cell") }
      </div>
      <div className="ten24-board-numbers-layer ten24-board-layer">
        { numbersInPlay.map(renderNumber) }
      </div>
    </div>
  )
}