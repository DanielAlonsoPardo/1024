import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import Leaderboard from '/imports/api/Leaderboard/Leaderboard.js';
import { App } from '/imports/ui/App.jsx';

Meteor.startup(() => {
  if (process.env.NODE_ENV === "testing") {
    console.log("node env -> " + process.env.NODE_ENV);
  } else if (process.env.NODE_ENV === "development") {
    console.log("node env -> " + process.env.NODE_ENV);
  } else if (process.env.NODE_ENV === "production") {
  }


  render(<App/>, document.getElementById('react-target'));
});

Leaderboard.registerServerMethods();