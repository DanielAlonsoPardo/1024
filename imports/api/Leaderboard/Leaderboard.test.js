import chai, { assert, done } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Accounts } from 'meteor/accounts-base';

import Leaderboard from './Leaderboard.js';

import { Dummies as LeaderboardDummies } from './testing.js';
import TestStuff from '/imports/lib/TestLib'

chai.use(chaiAsPromised);

let valid_leaderboard = LeaderboardDummies.Leaderboard.sample_entry;
let invalid_score = { ...valid_leaderboard };
invalid_score.score = valid_leaderboard.score + 1;

export const UnitTests = function() {
  describe("leaderboard tests", function() {
    describe("Schema", async function() {
      it("loaded correctly", function() {
        assert.isDefined(Leaderboard.Schema);
      });

      it("validates correctly", function() {
        let validate = (o) => (_ => Leaderboard.Schema.validate(o))
        assert.throws(validate({}), undefined, undefined, "does not reject empty object");
        assert.doesNotThrow(validate(valid_leaderboard), undefined, undefined, "does not validate a valid leaderboard");
        assert.throws(validate(invalid_score), undefined, undefined,"does not check score validity");
      });
    });
  });
};

export const ServerUnitTests = function() {
  describe("leaderboard tests (server only)", function() {
    it("Validates on insert", function() {
      let insert = async (o) => (_ => Leaderboard.Collection.insertAsync(o))
      assert.isRejected(insert({}), undefined, undefined, "does not reject empty object").notify(done);
      assert.isFulfilled(insert(valid_leaderboard), undefined, undefined, "does not accept valid object").notify(done);
      assert.isRejected(insert(invalid_score), undefined, undefined, "does not reject invalid score").notify(done);
      return Leaderboard.Collection.removeAsync(valid_leaderboard);
    });
  });
};

export const ClientUnitTests = function() {
  describe("leaderboard tests (client only)", function() {
    describe("Methods", function() {
      this.timeout(5000); 
      describe("submitScore", function() {
        describe("logged in", function() {
          let testuser
          before(async function() {
            return new Promise((resolve, reject) => {
              return Meteor.callAsync("createTempUser")
                .then(user => {
                  testuser = user
                  return Meteor.loginWithPassword(user.username, user.password, resolve)
                })

            });
          })
          after(async function() {
            return Meteor.callAsync("deleteCurrentUser")
          });
          afterEach(async function() {
            return Leaderboard.Collection.findOneAsync(valid_leaderboard)
              .then(lb => Leaderboard.Collection.removeAsync({ _id: lb._id }))
              .catch(_ => undefined)
          });
          it("accepts score if there is an active user", async function() {
            let submit = Meteor.callAsync(
              "Leaderboard.submitScore",
              { record: valid_leaderboard.record,
                score: valid_leaderboard.score })
            await assert.isFulfilled(submit)
            let search = submit.then(user => Leaderboard.Collection.findOneAsync({ username: testuser.username }))
            return assert.eventually.exists(search, "score not added to leaderboard");
          });
          it("bullshit!", async function() {})
          it("accepts score if there is an active user", async function() {})
        })
        describe("logged out", function() {
          it("rejects score if its not from an active user", function() {
            let submit = _ => Leaderboard.ServerMethods.submitScore._execute(
              { userId: "null" },
              { record: valid_leaderboard.record,
                score: valid_leaderboard.score });
            assert.throws(submit, "User must be logged in to submit a score", undefined);
          });
        })
      });
    })
  });
}