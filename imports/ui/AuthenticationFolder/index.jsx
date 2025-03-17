import React, { Fragment, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import './AuthenticationFolder.scss'
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
  return (
    <div className="authentication-folder">
      <Separator />
    </div>
  )
}

export const Separator = (props) => {
  return (
    <div className="folder-separator">
      <div className="folder-body"></div>
      <div class="folder-tab-name">anonymous</div>
      <div className="folder-tab-detail"></div>
    </div>
  )
}