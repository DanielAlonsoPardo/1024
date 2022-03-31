import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';

Meteor.startup(() => {
  console.log("node env -> " + process.env.NODE_ENV);
  if(process.env.NODE_ENV === "testing") {
  }
  if(process.env.NODE_ENV === "development") {
    render(<App/>, document.getElementById('react-target'));
  }
  if(process.env.NODE_ENV === "production") {
    render(<App/>, document.getElementById('react-target'));
  }
});
