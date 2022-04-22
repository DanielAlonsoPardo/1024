import { Game } from './Game.js';

let Game_dummies = {
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
  Game: Game_dummies,
};
export { Dummies };