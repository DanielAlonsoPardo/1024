import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import { Record } from '/imports/lib/Ten24/Game.js';
import { Game_replay } from '/imports/lib/Ten24/Game_replay.js';

const Schema = new SimpleSchema({
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

const Collection = new Mongo.Collection("Leaderboard");

const Leaderboard = Collection;

Collection.attachSchema(Schema);
// Deny all client-side updates on the Leaderboard collection
Collection.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});



const submitScore = new ValidatedMethod({
  name: "Leaderboard.submitScoreOG",
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
      Collection.insert(entry);
    },
});

function register_submitScore() {
  return new ValidatedMethod({
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
      Collection.insert(entry);
    },
  })
}

/* Prevent users from using an unregistered server method */
function throwNotRegistered() { throw "Cannot call method: not registered yet" }
const ServerMethods = {
  submitScore: throwNotRegistered,
};

/* Register every server method used by this API */
function registerServerMethods() {
  ServerMethods.submitScore = register_submitScore();
}

function Publish() {
  Meteor.publish('Leaderboard', function() {
    return Collection.find({});
  });
}

function Subscribe() {
  Meteor.subscribe('Leaderboard');
}

export {
  registerServerMethods,
  ServerMethods,
  Collection,
  Schema,
  Publish,
  Subscribe,
};