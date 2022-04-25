import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Record } from '/imports/lib/Ten24/Game.js';
import { Game_replay } from '/imports/lib/Ten24/Game_replay.js';

export const Schema = new SimpleSchema({
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
Leaderboard.attachSchema(Schema);
// Deny all client-side updates on the Leaderboard collection
Leaderboard.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
export { Leaderboard };

export const submitScore = new ValidatedMethod({
  name: "Leaderboard.submitScore",
  validate: new SimpleSchema({
                  record: Record.Schema,
                  score: SimpleSchema.Integer
                }).validator(),
  run({ record, score }) {
    if (!this.userId)
      throw new Meteor.Error("user-not-logged", "User must be logged in to submit a score");
    let user = Meteor.users.findOne({ _id: this.userId });
    if (!user) {
      throw new Meteor.Error("user-does-not-exist", "User must exist");
    }

    let entry = {
      username: user.username,
      date: new Date(),
      record,
      score,
    };
    Leaderboard.insert(entry);
  },
});