import React, { Fragment, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import { LoginForm } from '/imports/ui/UserAccountBar/LoginForm'
import { RegistrationForm } from '/imports/ui/UserAccountBar/RegistrationForm'

/** UserAccountBar
 *    Shows user account related info. That can be one of:
 *      viewProfile -> shows either current user's info and a logout button, or just the login/reg buttons
 *      register -> allows you to register, or informs of a recently sent verification email
 *      login -> allows you to login
 *
 * props:
 *   user: usetracker tracking the current Meteor.user()
 *
 */

export const AuthenticationFolder = (props) => {
  const [userState, setUserState] = useState('viewProfile'); //viewProfile, register, login
  const user = props.user;

  return (
    <div className="authentication-folder">
    
    </div>
  )
}