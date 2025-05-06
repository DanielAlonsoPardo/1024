import React, { Fragment, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

import './DocumentMenu.scss'
import { LoginForm } from './PageForms/LoginForm'
import { RegistrationForm } from './PageForms/RegistrationForm'
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

const DocumentMenuStates = {
  anonymous: {
    page: "anonymous",
    markers: {
      login: { invis: false },
      register: { invis: false },
    }
  },
  authenticated: {
    page: "authenticated",
    markers: {
      logout: { invis: false },
      settings: { invis: false },
    }
  },
  login: {
    page: "login",
    markers: {
      login: { invis: false },
      register: { invis: true }
    },
  },
  register: {
    page: "register",
    markers: {
      login: { invis: true },
      register: { invis: false }
    }
  },
  settings: {
    page: "settings",
    markers: {
      logout: { invis: true },
      settings: { invis: false },
    },
  },
}

export const DocumentMenu = ({ user }) => {

  let mainMenu = useTracker(() => ((user?.username) ? DocumentMenuStates.authenticated : DocumentMenuStates.anonymous), [user])
  let [menuState, setMenuState] = useState(mainMenu)
  useTracker(() => (setMenuState(mainMenu)), [mainMenu])

  function returnToMain(e) {
    e.preventDefault()
    setMenuState(mainMenu)
  }
  function changeMenu(menuState) {
    return (e) => {
      e.preventDefault()
      if (!menuState) window.alert("no menu state selected, contact developer")
      setMenuState(DocumentMenuStates[menuState])
    }
  }

  return (
    <div className="document-menu">
      <div className="document-menu-inner">
        <Separator tabName={ user?.username ?? "anonymous" }>
          <Page hidden={ menuState.page != "login" }>
            <LoginForm returnToMainMenu={ returnToMain }/>
            <button onClick={ returnToMain }>return</button>
          </Page>
          <Page hidden={ menuState.page != "register" }>
            <RegistrationForm changeMenu={ changeMenu } />
            <button onClick={ returnToMain }>return</button>
          </Page>
          <Page hidden={ menuState.page != "settings" }>
            Settings
            <button onClick={ returnToMain }>return</button>
          </Page>
        </Separator>

        <Marker
          onClick={changeMenu("login")}
          hidden={ !menuState.markers.login }
          invis={ menuState.markers.login?.invis }
        >
          Login
        </Marker>
        <Marker
          onClick={changeMenu("register")}
          hidden={ !menuState.markers.register }
          invis={ menuState.markers.register?.invis }
        >
          Register
        </Marker>
        <Marker
          onClick={ (e) => {e.preventDefault(); Meteor.logout()} }
          hidden={ !menuState.markers.logout }
          invis={ menuState.markers.logout?.invis }
        >
          Logout
        </Marker>
        <Marker
          onClick={changeMenu("settings")}
          hidden={ !menuState.markers.settings }
          invis={ menuState.markers.settings?.invis }
        >
          Settings
        </Marker>
      </div>
    </div>
  )
}





