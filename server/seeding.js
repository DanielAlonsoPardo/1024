import { Accounts } from 'meteor/accounts-base';
import { Leaderboard, Schema as LSchema } from '/imports/api/Leaderboard/Leaderboard.js';

import { Generators } from '/imports/lib/Ten24/testing.js';
import { Game_replay } from '/imports/lib/Ten24/Game_replay.js';

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'The GNU General Public License is a free, copyleft license for software and other kinds of works.';
const ADMIN_ACCOUNT = { username: SEED_USERNAME, password: SEED_PASSWORD };



const DEFAULT_LEADERBOARD_LEADERS = ["Ash Ketchum", "Johnny Bravo", "SlayerS_`BoxeR`", "Menganito", "Dr. Bacterio"];


export const Startup = function() {
  /* "admin" account */
  if (!Accounts.findUserByUsername(ADMIN_ACCOUNT.username))
    Accounts.createUser(ADMIN_ACCOUNT);

  /* Taken from [https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/] */
  let getHash = (str) => {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash;
    }
    return hash;
  }

  /* Populate the leaderboard a bit*/
  for (username of DEFAULT_LEADERBOARD_LEADERS) {
    if (Leaderboard.findOne({ username }) !== undefined)
      continue;

    let record = Generators.Record.generate(getHash(username));
    let replay = new Game_replay(record);
    replay.play();
    let score = replay.game.get_score();

    let entry = {
      username,
      date: new Date(),
      record,
      score,
    };

    Leaderboard.insert(entry);
  }

} 