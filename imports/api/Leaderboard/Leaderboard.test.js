import { assert } from 'chai';

import Leaderboard from './Leaderboard.js';

import { Dummies as Ten24Dummies } from '/imports/lib/Ten24/testing.js';
import { Dummies as LeaderboardDummies } from './testing.js';

export const UnitTests = function() {
  describe("leaderboard tests", function() {
    describe("Schema", function() {
      const Schema_leaderboard = Leaderboard?.Schema?.newContext();
      const Schema = Leaderboard?.Schema;
      let valid_leaderboard = LeaderboardDummies.Leaderboard.sample_entry;

      it("loaded correctly", function() {
        assert.isDefined(Leaderboard);
        assert.isDefined(Leaderboard?.Schema);
      });

      it("validates correctly", function() {
        let example = valid_leaderboard;
        assert.throws(_ => Schema.validate({}), undefined, undefined, "does not reject empty object");
        assert.doesNotThrow(_ => Schema.validate(valid_leaderboard), undefined, undefined, "does not validate a valid leaderboard");
        let invalid_score = { ...valid_leaderboard };
        invalid_score.score = valid_leaderboard.score + 1;
        assert.throws(_ => Schema.validate(invalid_score), undefined, undefined,"does not check score validity");
      });
    });
  });
};
