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

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setUsername(data.username)
    setPassword(data.password)

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
      </form>
      <div className="login-form-error-message">{errmsg}</div>
    </div>
  );

}