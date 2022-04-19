import React from 'react';

import Ten24 from '/imports/lib/Ten24';

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
   *    created, // true if it was created this turn.
   *    slide: { //optional, if the cell should be shown as sliding
   *             //to be interpreted as "where this tile slid from to end up where it is"
   *      direction, //one of Ten24.Game.Move_code
   *      distance   //1-3 },
   *  }
   *
  **/
  static renderNumber(number, globalDelay) {
    let classNames = "";
    classNames = "ten24-cell "
      + `ten24-row-${number.position.row} `
      + `ten24-col-${number.position.column} `
      + (number.slide ? `slide-from-${number.slide.direction}-${number.slide.distance} sliding ` : "")
      + (number.combined ? `combined appear-delay-${number.combined} ` : "")
      + ((number.created && ! number.combined) ? `created appear-delay-${globalDelay || 3} ` : "")
    return (<div className={ classNames } key={ number.id }> { number.value } </div>);
  }

  //----** Instance **----//

  numbersInPlay = [];//Array of `number`s that are currently in play, to be rendered.
  tempNumbers = [];//Array of `number`s that exist only for rendering purposes. Periodically emptied.
  ID = 0;// used to generate React `key` attributes, or to force rendering.
  state = {
    numbersInPlay: this.numbersInPlay,
    tempNumbers: this.tempNumbers,
    ID: this.ID
  };
  game = null;

  constructor(props) {
    super(props);
    let callbacks = {
      on_slide: this.callback_on_slide.bind(this),
      on_combine: this.callback_on_combine.bind(this),
      on_place: this.callback_on_place.bind(this)
    };
    this.game = new Ten24.Game(this.props?.seed, callbacks);
  }

  componentDidMount() {
    this.game.start();
  }

  /*  callback_on_slide(fromInfo, toInfo, slideInfo)
   *    fromInfo -> numberInfo of the number (before sliding)
   *    toInfo -> numberInfo of the number that will get overwritten after the slide
   *    slideInfo -> type of slide to be performed
   */
  callback_on_slide(fromInfo, toInfo, slideInfo) {
    let travel = {
      distance: Math.abs(slideInfo.to - slideInfo.from),
      direction: Ten24.Game.translate_slideInfo(slideInfo)
    }
    this.slideNumber(fromInfo.position, toInfo.position, travel);
  }

  /** callback(combinedNumberInfo)
   *
  **/
  callback_on_combine(combinedNumberInfo) {
    this.combineNumbers(combinedNumberInfo.position, combinedNumberInfo.value);
  }

  /**
   *  Add a number to numbersInPlay
   *  numberInfo -> Describes a given number on the board (see Engine `numberInfo`)
   *  numberInfo = {
   *      value,
   *      position: { column, row }
   *    }
   */
  callback_on_place(numberInfo) {
    this.placeNumber(numberInfo.position.row, numberInfo.position.column, numberInfo.value);
  }

  /**
   * Creates a new number tile to be displayed on the board
   *
   */
  placeNumber(row, column, value, combined, debugflag) {
    let number = {
      position: {
        row,
        column
      },
      combined: combined || 0,
      slide: null,
      value,
      created: combined ? false : true,
      id: this.ID
    }

    this.numbersInPlay.push(number);
    this.ID++;
    this.setState({
      ID: this.ID,
      numbersInPlay: this.numbersInPlay//friendly reminder that this line might not force a re-render
    });
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
                             n.position.row == from.row)
    let n = this.numbersInPlay.find(numberFrom);
    if (!n) return;

    n.position = to;
    n.slide = { ...travel };

    this.ID++;
    this.setState({
      numbersInPlay: this.numbersInPlay,//friendly reminder that this line might not force a re-render
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
    let combinable = (number) => (number.position.row    == pos.row &&
                                  number.position.column == pos.column)
    //move any numbers that have combined out of the board and into temp numbers
    let numbersLeft = this.numbersInPlay.filter(n => !combinable(n));
    let numbersToCombine = this.numbersInPlay.filter(combinable).map(n => { n.combined = 0; return n });
    this.tempNumbers = this.tempNumbers.concat(numbersToCombine);
    this.numbersInPlay = numbersLeft;
    this.setState({ numbersInPlay: this.numbersInPlay, tempNumbers: this.tempNumbers });

    //place new number on the board
    let combined = Math.max(0, ...numbersToCombine.map(n => n.slide?.distance || 0));
    this.placeNumber(pos.row, pos.column, value, combined || 0);
  }

  move(moveCode) {
    //number cleanup
    //tempNumbers are for rendering purposes only and should be removed to last only one turn
    this.tempNumbers = [];
    //reset single-turn states
    this.numbersInPlay = this.numbersInPlay.map(n => {
      n.slide = null;
      n.combined = 0;
      n.created = false;
      return n; 
    });
    this.setState({ tempNumbers: this.tempNumbers, numbersInPlay: this.numbersInPlay });
    this.game.move(moveCode);
    let n = 0;
  }

  render() {
    let fillWithEmptyCells = () => {
      let divs = [];
      let id = 0;
      for (let row = 0; row < 4; row++)
        for (let col = 0; col < 4; col++)
          divs.push(<div className={ `ten24-cell ten24-col-${col} ten24-row-${row}` } key={id++}></div>);
      return divs;
    }
    let renderAllNumbers = () => {
      let allNumbers = this.state.numbersInPlay.concat(this.state.tempNumbers);
      let maxSlideDistance = allNumbers.reduce((acc, n) => Math.max(n.slide?.distance || 0, acc), 1);
      return allNumbers.map(n => Ten24Board.renderNumber(n, maxSlideDistance));
    }

    return (
      <div className="ten24-board">
        <button onClick={ e => { this.move(Ten24.Game.Move_code.Up) } }>up</button>
        <button onClick={ e => { this.move(Ten24.Game.Move_code.Down) } }>down</button>
        <button onClick={ e => { this.move(Ten24.Game.Move_code.Left) } }>left</button>
        <button onClick={ e => { this.move(Ten24.Game.Move_code.Right) } }>right</button>
        <button onClick={ e => { console.log("numbersInPlay:");
                                 this.state.numbersInPlay.map(n => console.log(n));
                                 console.log("tempNumbers:");
                                 this.state.tempNumbers.map(n=> console.log(n)); } }>
          console log </button>
  
        <div className="ten24-board-background-layer">
        </div>
        <div className="ten24-board-empty-cell-layer ten24-board-layer">
          { fillWithEmptyCells() }
        </div>
        <div className="ten24-board-numbers-layer ten24-board-layer">
          { renderAllNumbers() }
        </div>
      </div>
    )
  }
}

export { Ten24Board };