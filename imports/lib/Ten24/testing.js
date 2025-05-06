import { Game } from './Game.js';

let generateRandomGameRecord = (seed) => {
    let game = new Game(seed ?? Math.random());
    game.start();
    while(!game.ended()) {
      game.move_up();
      game.move_down();
      game.move_left();
      game.move_right();
    }
    return game.get_record();
}


let full_game = generateRandomGameRecord();

let Dummies = {
  Record: { full_game },
};

let Generators = {
  Record: { generate: generateRandomGameRecord },
}

export { Dummies, Generators };