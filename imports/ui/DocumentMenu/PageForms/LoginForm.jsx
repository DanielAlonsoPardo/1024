import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import Login from '@react-login-page/base';

import "./PageForms.scss"

export const LoginForm = ({ returnToMainMenu }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errmsg, setErrmsg] = useState('');

  const submit = e => {
    e.preventDefault();

    Meteor.loginWithPassword(username, password,
      (err) => {
        if (err) {
          setErrmsg(err.reason);
        } else {
          console.log("logged in");
          setErrmsg("");
          returnToMainMenu(e)
        }
      });
  };

  return (
    <div>
      <form onSubmit={submit} className="login-form">
        <Login style={{ height: 380 }}>
          <Login.Logo>
            <img src="/favicon.ico" alt="1024" width="18" height="18" />
          </Login.Logo>
        </Login>
{/*        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username" name="username" required
          onChange={e => setUsername(e.target.value)}/>

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" name="password" required
          onChange={e => setPassword(e.target.value)}/>

        <button type="submit">Log In</button>*/}
      </form>
      <div className="login-form-error-message">{errmsg}</div>
    </div>
  );

}