import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { Roles } from 'meteor/alanning:roles';
import { Restivus } from 'meteor/nimble:restivus';

import Leaderboard from '/imports/api/Leaderboard/Leaderboard.js';
import Seeding from './seeding.js';
import crypto from 'crypto';

/* Startup */
Meteor.startup(() => {
  if (!process.env.MAIL_URL) {
    console.warn("environment variable for mailing not set!");
  }

  Seeding.Startup();

  /* Publications */
  Leaderboard.Publish();

  //current user's roles
  //https://github.com/Meteor-Community-Packages/meteor-roles#installing
  Meteor.publish(null, function () {
    if (this.userId) {
      return Meteor.roleAssignment.find({ 'user._id': this.userId });
    } else {
      this.ready();
    }
  });
});

/* Roles */
Roles.createRole("verified", { unlessExists: true });

/* Server methods */
Meteor.methods({
  sendVerificationEmail() {
    let hash = getRandomVerificationHash();
    let email = {
      to: "danielalonsopardo@gmail.com",
      from: "danielalonsopardo@gmail.com",
      subject: "Verification email - 1024",
      text: "Verification hash: " + hash,
    }
    console.log("Pretending to send an email...");
    console.log("Generated verification hash " + hash);
//    Email.send(email);
    return true;
  },
});

/* Accounts */
Accounts.validateLoginAttempt((attempt) => {
  if (!attempt.allowed) {
    return false;
  }

  console.log("success");
  return Roles.userIsInRole(attempt.user._id, "verified");
})

function getRandomVerificationHash() {
  let hash = crypto.createHash('sha256');
  return hash.update(crypto.randomBytes(10)).digest('hex');
}

Accounts.onCreateUser((options, user) => {
  user.verification = getRandomVerificationHash();
  return user;
});

/* API Routes */
var Api = new Restivus({
  useDefaultAuth: true,
  prettyJson: true
});
Api.addRoute("verification", {
  get() {
    if (!this.queryParams.hash)
      return { statusCode: 400,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: `Malformed verification link.`,
      };

    let user = Accounts.users.findOne({ verification: this.queryParams.hash.toString() });
    if (!user)
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: `Invalid or expired verification link.`,
      };
    else {
      Accounts.users.update({ _id: user._id }, { $unset: { verification: 1 }});
      Roles.addUsersToRoles(user._id, 'verified');
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
        body: `${ user.username }'s account has been validated! You may now log in.`,
      };
    }
  }
});