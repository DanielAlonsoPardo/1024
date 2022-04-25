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

export const UserAccountBar = (props) => {
  const [userState, setUserState] = useState('viewProfile'); //viewProfile, register, login
  const user = props.user;

  function UserAccountButtons() {
    if (user) {
      return ( <div className="user-account-buttons">
                 <button onClick={() => Meteor.logout()}>logout</button>
               </div> );
    } else {
      return ( <div className="user-account-buttons">
                 <button onClick={() => setUserState("login")}>login</button>
                 <button onClick={() => setUserState("register")}>register</button>
               </div> );
    }
  }

  function CurrentInfo() {
    if (user) {
      setUserState("viewProfile");
      return (<>Currently logged in as: {user.username}</>)
    }
    switch (userState) {
      case "login":
        return (<LoginForm/>)
      case "register":
        return (<RegistrationForm/>)
      case "viewProfile":
      default:
        return (<>"Log in to save your hi-score!"</>)

    }    
  }

  const validStates = ["viewProfile", "register", "login", "verificationSent"];

  return ( <div className="user-account-bar">
             <CurrentInfo/>
             <UserAccountButtons/>
           </div> )
}