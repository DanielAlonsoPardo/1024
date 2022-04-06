import React, { useState } from 'react';

import './Ten24Board.css'

export const Ten24Board = () => {
  const [counter, setCounter] = useState(1);
  let makedivs = (amount, className) => {
    let divs = [];
    for (let i = 0; i < amount; i++)
      divs.push(<div className={className} key={i}></div>);
    return divs;
  }
  return (
    <div className="ten24-board">
      <button onClick={ e => setCounter(counter + 1)}>grrr</button>
      <div className="ten24-board-background-layer">
      </div>
      <div className="ten24-board-empty-cell-layer ten24-grid-layer">
        { makedivs(4**2, "ten24-cell") }
      </div>
      <div className="ten24-board-numbers-layer ten24-grid-layer">
        { makedivs(counter, "ten24-cell") }
      </div>
    </div>
  )
}