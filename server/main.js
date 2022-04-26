import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { Roles } from 'meteor/alanning:roles';

import Leaderboard from '/imports/api/Leaderboard/Leaderboard.js';
import Seeding from './seeding.js';

Meteor.startup(() => {
  if (!process.env.MAIL_URL) {
    console.warn("environment variable for mailing not set!");
  }

  Roles.createRole("verified", {unlessExists: true});
  Seeding.Startup();
});

Meteor.methods({
  sendVerificationEmail() {
    let email = {
      to: "danielalonsopardo@gmail.com",
      from: "danielalonsopardo@gmail.com",
      subject: "Verification email - 1024",
      text: "Hello, World!"
    }
    console.log("Pretending to send an email...");
//    Email.send(email);
    return true;
  }
});

//publications
Leaderboard.Publish();

//user roles
//https://github.com/Meteor-Community-Packages/meteor-roles#installing
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  } else {
    this.ready()
  }
});

Accounts.validateLoginAttempt((attempt) => {
  console.log("LOGIN ATTEMPT");
  if (!attempt.allowed) {
    return false;
  }

  console.log("success");
  return Roles.userIsInRole(attempt.user._id, "verified");
})