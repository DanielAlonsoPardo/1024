import React, { Fragment, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import './DocumentMenu.scss'
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

export const DocumentMenu = (props) => {
  return (
    <div className="document-menu">
      <div className="document-menu-inner">
        <Separator />
      </div>
    </div>
  )
}

export const Page = (props) => {
  return (
    <div className="page">
      blabla
    </div>
  )
}

export const Separator = (props) => {
  return (
    <div className="separator">
      <div className="separator-body">
        <Page />
        <PageMarker />
        <PageMarker />
      </div>
      <SeparatorTab />
    </div>
  )
}

export const SeparatorTab = (props) => {
  return (
    <div className="separator-tab">
      <div className="separator-tab-name">anonymous</div>
      <div className="separator-tab-detail"></div>
    </div>
  )
}

export const PageMarker = (props) => {
  return (
    <div className="page-marker">
      <div className="page-marker-transparent">
      </div>
      <div className="page-marker-name">
      blabli
      </div>
    </div>
  )
}