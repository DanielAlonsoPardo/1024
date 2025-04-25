import React, { Fragment, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import './DocumentMenu.scss'
import { LoginForm } from '/imports/ui/UserAccountBar/LoginForm'
import { RegistrationForm } from '/imports/ui/UserAccountBar/RegistrationForm'
import { Page, Marker, Separator } from './Elements'

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

const DocumentMenuStates = [
  "anonymous",
  "authenticated",
  "login",
  "register",
  "settings",
]

export const DocumentMenu = (props) => {
  return (
    <div className="document-menu">
      <div className="document-menu-inner">
        <Separator>
          <Page>Page</Page>
        </Separator>
        <Marker>Marker 1</Marker>
        <Marker>Marker 2</Marker>
        <Marker>Marker 3</Marker>
      </div>
    </div>
  )
}





