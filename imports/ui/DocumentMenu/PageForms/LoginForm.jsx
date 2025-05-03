import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const LoginForm = () => {
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
        }
      });
  };

  return (
    <div>
      <form onSubmit={submit} className="login-form">
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username" name="username" required
          onChange={e => setUsername(e.target.value)}/>

        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" name="password" required
          onChange={e => setPassword(e.target.value)}/>

        <button type="submit">Log In</button>
      </form>
      <div className="login-form-error-message">{errmsg}</div>
    </div>
  );

}