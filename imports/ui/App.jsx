import React, { Fragment } from 'react';
import { LoginForm } from '/imports/ui/LoginForm.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  const logout = () => Meteor.logout();
  return (
    <div>
      { user
        ? ( <Fragment>
              <div>LOGGED IN</div>
              <button onClick={ () => logout() } >Logout</button>
            </Fragment> )
        : ( <Fragment>
              <div>LOGGED OUT</div>
              <LoginForm/> 
            </Fragment> ) }
      <h1>Play 1024!</h1>
    </div>
  )
};
