import assert from 'assert';

import { UnitTests as Ten24_test } from '/imports/lib/Ten24/Ten24.test.js';


let UnitTests = {
  Ten24_test,
  
}

describe("Sanity check", function () {
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