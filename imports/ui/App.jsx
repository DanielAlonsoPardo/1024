import React, { Fragment } from 'react';
import { useTracker }      from 'meteor/react-meteor-data';
import { Meteor }          from 'meteor/meteor';

import { UserAccountBar } from '/imports/ui/UserAccountBar';
import { Ten24Board } from '/imports/ui/Ten24Board';
import { LeaderboardTable } from '/imports/ui/LeaderboardTable/LeaderboardTable.jsx';
import { AuthenticationFolder } from './AuthenticationFolder';

//Object.keys(foo).forEach(prop => console.log(prop));
//console.log("_____________________________________")

import '/imports/ui/App.css';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  return (
    <>
      <div className="title">
        <h1>COMBINATOR</h1>
      </div>
      <div className="ten24-container"> <Ten24Board /*seed={10}*//> </div>
    </>
  )
};

//      <UserAccountBar user={user}/>
//      <div className="authentication-folder-container"><AuthenticationFolder user={user}/> </div>
//      <h1>Play 1024!</h1>
//      <div className="ten24-container"> <Ten24Board /*seed={10}*//> </div>
//      <LeaderboardTable/>
//      <button onClick={ () => { Meteor.call("sendVerificationEmail") } }>Server Button</button>
