import React, { Fragment } from 'react';
import { useTracker }      from 'meteor/react-meteor-data';
import { Meteor }          from 'meteor/meteor';

import { UserAccountBar }        from '/imports/ui/UserAccountBar';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  return (
    <>
      <UserAccountBar user={user}/>
      <h1>Play 1024!</h1>
      <button onClick={ () => { Meteor.call("sendVerificationEmail") } }>Server Button</button>
    </>
  )
};
