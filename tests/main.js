import assert from 'assert';

import { UnitTests as Ten24_test } from '/imports/lib/Ten24/Ten24.test.js';
import { UnitTests as Ten24Board_test } from '/imports/ui/Ten24Board/Ten24Board.test.jsx';


let UnitTests = {
  Ten24_test,
  Ten24Board_test
}

describe("Sanity check", function () {
  
  this.timeout(1000);
  if (Meteor.isClient) {
    it("CLIENT CHECK", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("SERVER CHECK", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});

for (const property in UnitTests) {
  UnitTests[property]();
}