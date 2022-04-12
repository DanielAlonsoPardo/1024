import React, { Fragment } from 'react';
import { useTracker }      from 'meteor/react-meteor-data';
import { Meteor }          from 'meteor/meteor';

import { UserAccountBar } from '/imports/ui/UserAccountBar';
import { Ten24Board } from '/imports/ui/Ten24Board/Ten24Board.jsx';

import '/imports/ui/App.css';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  return (
    <>
      <UserAccountBar user={user}/>
      <h1>Play 1024!</h1>
      <div className="ten24-container"> <Ten24Board seed={10}/> </div>
      <button onClick={ () => { Meteor.call("sendVerificationEmail") } }>Server Button</button>
    </>
  )
};
