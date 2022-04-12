import React, { useState } from 'react';

import './Ten24Board.scss'

/** Ten24Board
 *
 *  React component that provides a Ten24 game, its view,
 *    bindings to hook to events, as well as an initial keyboard binding setup.
 *
 */
class Ten24Board extends React.Component {
  //** ---- Static ---- **//
  /** renderNumber
   *
   *  Renders a single number tile.
   *    number -> Should contain all the info necessary to render a number on the board.
   *
   *  number = {
   *    value, //preferably powers of 2 only
   *    id,    //its React key
   *    position: {
   *      row,
   *      column },
   *    combined, //0, if the cell was not created from being combined
   *             //equals to the distance of the farthest number being combined 
   *    slide: { //optional, if the cell should be shown as sliding
   *             //to be interpreted as "where this tile slid from to end up where it is"
   *      direction, //<"up"|"down"|"left"|"right">
   *      distance   //1-3 },
   *  }
   *
   */
  static renderNumber(number) {
    let classNames = "";
    classNames = "ten24-cell "
      + `ten24-row-${number.position.row} `
      + `ten24-col-${number.position.column} `
      + (number.slide ? `slide-from-${number.slide.direction}-${number.slide.distance} sliding` : "");
    return (<div className={ classNames } key={ number.id }> { number.value } </div>);
  }

  //----** Instance **----//

  //Numbers in play on the board
  numbersInPlay = [];
  //Numbers that must be shown for rendering purposes, but are not actually in play.
  //  Should be emptied on every turn start.
  tempNumbers = [];
  ID = 0;// used for React `key` attr.
  state = {
    numbersInPlay: this.numbersInPlay,
    tempNumbers: this.tempNumbers,
    ID: this.ID
  };

  constructor(props) {
    super(props);
  }

  /**
   * Creates a new number tile to be displayed on the board
   */
  placeNumber(row, column, value, combined) {
    let number = {
      position: {
        row,
        column
      },
      combined: combined || 0,
      slide: null,
      value,
      id: this.ID
    }

    this.numbersInPlay.push(number);
    this.ID++;
    //friendly reminder that mutating numbersInPlay then setting it to itself will not cause a re-render
    this.setState({ ID: this.ID, numbersInPlay: this.numbersInPlay });
  }

  /**
   * Moves a tile from one spot to another and provides animation info (to show the sliding action)
   *
   * from = { row, column }
   * to = { row, column }
   * travel = { distance, direction } // what movement the number did to go from `from` to `to`
   */
   slideNumber(from, to, travel) {
    let numberFrom = (n) => (n.position.column == from.column &&
                             n.position.row == from.row &&
                             n.slide == null)
    let n = this.numbersInPlay.find(numberFrom);
    if (!n) return;

    n.position = to;
    n.slide = { ...travel };

    this.ID++;
    this.setState({
      //friendly reminder that mutating numbersInPlay then setting it to itself will not cause a re-render
      numbersInPlay: this.numbersInPlay,
      ID: this.ID//force a re-render.
    });
  }

  // pos = { row, column }
  /**
   *  Creates a new number at position `pos` with the given value,
   *    and places any other numbers at that same position into the `tempNumbers` array.
   *  
   *  Assumes there has been an actual combination at that position, meaning that 
   *    the two numbers that just combined have already slid into position `pos`
   *    and must be taken out of `numbersInPlay` and into `tempNumbers`.
   */
  combineNumbers(pos, value) {
    let overwritable = (number) => (number.position.row    == pos.row &&
                                    number.position.column == pos.column)
    //move any numbers that have combined out of the board and into temp numbers
    let numbersLeft = this.numbersInPlay.filter(n => !overwritable(n));
    let numbersToCombine = this.numbersInPlay.filter(overwritable);
    this.tempNumbers = this.tempNumbers.concat(numbersToCombine)
    this.numbersInPlay = numbersLeft;
    this.setState({ numbersInPlay: this.numbersInPlay, tempNumbers: this.tempNumbers });

    //place new number on the board
    let combined = Math.max(...(numbersToCombine.map(n => n.slide?.distance)));
    this.placeNumber(pos.row, pos.column, value, combined || 0);
  }

  render() {
    let placeNumberFake = () => {
      this.placeNumber(0, 0, 2);
      this.placeNumber(1, 1, 2);
      this.placeNumber(2, 2, 2);
      this.placeNumber(3, 3, 2);
    }
  
    let placeNumberFake2 = () => {
      this.placeNumber(3, 0, 2);
      this.placeNumber(3, 0, 2);
      this.placeNumber(3, 0, 2);
    }
    let combineNumbersFake = () => {
      this.combineNumbers({row: 3, column: 0}, 33);
    }
  
    let slideNumberFake = () => {
      let pos = (row, col) => ({ row: row, column: col })
      let to = (dist, dir) => ({ distance: dist, direction: dir })
      this.slideNumber(pos(0, 0), pos(0, 3), to(3, "right"));
      this.slideNumber(pos(1, 1), pos(1, 3), to(2, "right"));
      this.slideNumber(pos(2, 2), pos(2, 3), to(1, "right"));
    }

    let fillWithEmptyCells = () => {
      let divs = [];
      let id = 0;
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 4; col++)
          divs.push(<div className={ `ten24-cell ten24-col-${col} ten24-row-${row}` } key={id++}></div>);
      return divs;
    }

    return (
      <div className="ten24-board">
        <button onClick={ e => { placeNumberFake() } }>placeNumberFake</button>
        <button onClick={ e => { slideNumberFake() } }>slideNumberFake</button>
        <button onClick={ e => { placeNumberFake2() } }>place combine</button>
        <button onClick={ e => { combineNumbersFake() } }>test combine</button>
        <button onClick={ e => { console.log("numbersInPlay:");
                                 this.state.numbersInPlay.map(n => console.log(n));
                                 console.log("tempNumbers:");
                                 this.state.tempNumbers.map(n=> console.log(n)); } }>console log</button>
  
        <div className="ten24-board-background-layer">
        </div>
        <div className="ten24-board-empty-cell-layer ten24-board-layer">
          { fillWithEmptyCells() }
        </div>
        <div className="ten24-board-numbers-layer ten24-board-layer">
          { this.state.numbersInPlay.map(n => renderNumber(n)) }
          { this.state.tempNumbers.map(n => renderNumber(n)) }
        </div>
      </div>
    )
  }
}

/** translate_slideDir(slideDir) => direction
  *  Converts a slideDir into a direction
  *
  *  slideDir = { slideAwayFromStart, slideVertically }
  *  //see Ten24.Engine.slide_numbers_raw()
  *
  *  direction = <"up"|"down"|"left"|"right">
  */





export { Ten24Board };