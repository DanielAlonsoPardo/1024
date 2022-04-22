import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SSchema from 'simpl-schema';
import { Record } from '/imports/lib/Ten24/Game.js';
import { Game_replay } from '/imports/lib/Ten24/Game_replay.js';

export const Schema = new SSchema({
  username: String,
  date: Date,
  record: Record.Schema,
  score: {
    type: Number,
    custom: function() {
      let record = this.siblingField('record').value;
      let score = this.value;
      let replay = new Game_replay(record);
      if (!replay.validate(score))
        return "Score does not match record";
    }
  },
});


const Leaderboard = new Mongo.Collection("Leaderboard");
Leaderboard.schema = Schema;
export { Leaderboard };
