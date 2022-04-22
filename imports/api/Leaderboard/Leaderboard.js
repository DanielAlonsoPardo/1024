import { Meteor } from 'meteor/meteor';
import SSchema from 'simpl-schema';
import { Record } from '/imports/lib/Ten24/Game.js';
import { Game_replay } from '/imports/lib/Ten24/Game_replay.js';

let Schema = new SSchema({
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


export default { Schema };