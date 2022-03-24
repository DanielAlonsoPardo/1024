import React, { Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { LoginForm } from '/imports/ui/LoginForm.jsx';

export const LoginBar = () => {
  const user = useTracker(() => Meteor.user());
  function logout() { return Meteor.logout(); }

  return (
    <div>
      { user
        ? ( <Fragment>
              <div>LOGGED IN AS: "{user.username}"</div>
              <button onClick={ () => logout() }>Logout</button>
            </Fragment> )
        : ( <Fragment>
              <div>LOGGED OUT</div>
              <LoginForm/> 
            </Fragment> ) }
    </div>
  );
};


/*

*/