import React, { Fragment } from 'react';
import { useTracker }      from 'meteor/react-meteor-data';
import { Meteor }          from 'meteor/meteor';

import { UserAccountBar } from '/imports/ui/UserAccountBar';
import { Ten24Board } from '/imports/ui/Ten24Board';
import { LeaderboardTable } from '/imports/ui/LeaderboardTable/LeaderboardTable.jsx';
import { DocumentMenu } from '/imports/ui/DocumentMenu';

//Object.keys(foo).forEach(prop => console.log(prop));
//console.log("_____________________________________")

import '/imports/ui/App.css';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  return (
    <>
      <div className="document-menu-container"><DocumentMenu userName={ user }/> </div>
      <div className="ten24-container"> <Ten24Board /*seed={10}*//> </div>
    </>
  )
};

//      <UserAccountBar user={user}/>
//      <h1>Play 1024!</h1>
//      <div className="ten24-container"> <Ten24Board /*seed={10}*//> </div>
//      <LeaderboardTable/>
//      <button onClick={ () => { Meteor.call("sendVerificationEmail") } }>Server Button</button>
