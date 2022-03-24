import React, { Fragment } from 'react';
import { useTracker }      from 'meteor/react-meteor-data';
import { Meteor }          from 'meteor/meteor';

import { LoginBar }        from '/imports/ui/LoginBar.jsx';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  return (
    <>
      <LoginBar/>
      <h1>Play 1024!</h1>
    </>
  )
};
