import React, { Fragment } from 'react';
import { LoginBar } from '/imports/ui/LoginBar.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  return (
    <div>
      <LoginBar/>
      <h1>Play 1024!</h1>
    </div>
  )
};
