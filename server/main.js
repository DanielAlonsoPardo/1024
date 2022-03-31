import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { Accounts } from 'meteor/accounts-base';

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'The GNU General Public License is a free, copyleft license for software and other kinds of works.';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME))
    Accounts.createUser({ username: SEED_USERNAME, password: SEED_PASSWORD });

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