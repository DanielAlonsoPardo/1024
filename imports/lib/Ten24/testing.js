import { Game } from './Game.js';

let Record_dummies = {
  full_game: (_ => {
    let game = new Game(1);
    game.start();
    while(!game.ended()) {
      game.move_up();
      game.move_down();
      game.move_left();
      game.move_right();
    }
    return game.get_record();
  })(),
}

let Dummies = {
  Record: Record_dummies,
};
export { Dummies };