import { assert } from 'chai';
import { Random } from 'meteor/random';
import { Accounts } from 'meteor/accounts-base';

import { Collection,
         Schema,
         ServerMethods,
       } from './Leaderboard.js';

import { Dummies as Ten24Dummies } from '/imports/lib/Ten24/testing.js';
import { Dummies as LeaderboardDummies } from './testing.js';

let valid_leaderboard = LeaderboardDummies.Leaderboard.sample_entry;
let invalid_score = { ...valid_leaderboard };
invalid_score.score = valid_leaderboard.score + 1;

export const UnitTests = function() {
  describe("leaderboard tests", function() {
    describe("Schema", function() {
      it("loaded correctly", function() {
        assert.isDefined(Schema);
      });

      it("validates correctly", function() {
        let validate = (o) => (_ => Schema.validate(o))
        assert.throws(validate({}), undefined, undefined, "does not reject empty object");
        assert.doesNotThrow(validate(valid_leaderboard), undefined, undefined, "does not validate a valid leaderboard");
        assert.throws(validate(invalid_score), undefined, undefined,"does not check score validity");
      });
    });
  });
};

export const ServerUnitTests = function() {
  describe("leaderboard tests (server only)", function() {
    describe("Methods", function() {
      it("Validates on insert", function() {
        let insert = (o) => (_ => Collection.insert(o))
        assert.throws(insert({}), undefined, undefined, "does not reject empty object");
        assert.doesNotThrow(insert(valid_leaderboard), undefined, undefined, "does not accept valid object");
        assert.throws(insert(invalid_score), undefined, undefined, "does not reject invalid score");
        Collection.remove(valid_leaderboard);
      });
      describe("submitScore", function() {
        let sampleAccount;

        before(function() {
          let _id = Accounts.createUser({ username: "Lester the tester", password: "aibnexclk" });
          sampleAccount = Meteor.users.findOne({ _id });
        });

        after(function() {
          Meteor.users.remove({ username: sampleAccount.username });
        });

        afterEach(function() {
          Collection.remove({ record: valid_leaderboard.record });
        });
        it("rejects score if its not from an active user", function() {
          let submit = _ => ServerMethods.submitScore.call({ record: valid_leaderboard.record, score: valid_leaderboard.score });
          assert.throws(submit, "User must be logged in to submit a score", undefined);
        });
        it("accepts score if there is an active user", function() {
          let submit = _ => ServerMethods.submitScore._execute(
            { userId: sampleAccount._id },
            { record: valid_leaderboard.record,
              score: valid_leaderboard.score });
          assert.doesNotThrow(submit);
          assert.exists(Collection.findOne({ username: sampleAccount.username }), "score not added to leaderboard");
        });
      });
    });
  });
};

export const ClientUnitTests = function() {
//  describe("leaderboard tests (client only)", function() {
//    describe("submitScore", function() {
//      it("exists");
//    })
//  });
}