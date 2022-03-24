import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const SEED_USERNAME = 'admin';
const SEED_PASSWORD = 'The GNU General Public License is a free, copyleft license for software and other kinds of works.';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME))
    Accounts.createUser({ username: SEED_USERNAME, password: SEED_PASSWORD });
});
