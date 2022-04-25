import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';

import { Startup } from './seeding.js';

Meteor.startup(() => {
  Startup();

  if (!process.env.MAIL_URL) {
    console.warn("environment variable for mailing not set!");
  }
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