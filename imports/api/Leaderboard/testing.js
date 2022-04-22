import { Game_replay } from '/imports/lib/Ten24/Game_replay.js';
import { Dummies as Ten24Dummies } from '/imports/lib/Ten24/testing.js';

let Leaderboard = {
  sample_entry: (_ => {
    let replay = new Game_replay(Ten24Dummies.Record.full_game);
    replay.play();
    return {
      score: replay.game.get_score(),
      username: "admin",
      date: new Date("1970"),
      record: Ten24Dummies.Record.full_game,
    };
  })(),
};

let Dummies = { Leaderboard };
export { Dummies };