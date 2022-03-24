import React, { Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { LoginForm } from '/imports/ui/LoginForm.jsx';

export const LoginBar = () => {
  const user = useTracker(() => Meteor.user());
  function logout() { return Meteor.logout(); }

  return (
    <div class="login-bar">
      { user
        ? ( <>
              <div>LOGGED IN AS: "{user.username}"</div>
              <button onClick={ () => logout() }>Logout</button>
            </> )
        : ( <>
              <div>LOGGED OUT</div>
              <LoginForm/> 
            </> ) }
    </div>
  );
};


/*

*/