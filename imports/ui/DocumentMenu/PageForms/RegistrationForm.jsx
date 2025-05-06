import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import Login, { Input } from '@react-login-page/base';

export const RegistrationForm = ({ returnToMainMenu }) => {
  const [errmsg, setErrmsg] = useState('');

  const submit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    setErrmsg("");

    if (data.password != data.repassword) {
      setErrmsg("Your passwords do not match")
      return
    }

    Accounts.createUser({ username: data.username, password: data.password },
      (err) => {
        if (err) {
          console.log(err)
          if (err.reason == "Something went wrong. Please check your credentials.")
            setErrmsg("Something went wrong. (hint: maybe the username already exists)");
          else
            setErrmsg(err.reason)
        } else {
          console.log("register");
          setErrmsg("");
          console.log("submitting registration form");
          returnToMainMenu(e)
        }
      })
  }

  return (
    <div>
      <form onSubmit={submit} className="login-form">
        <Login style={{ height: 380 }}>
          <Login.Logo>
            <img src="/favicon.ico" alt="1024" width="18" height="18" />
          </Login.Logo>
          <Login.Title>
            New account
          </Login.Title>
          <Input name="repassword" type="password" index={3} placeholder="Re-enter password" />
        </Login>
      </form>
{/*        <form onSubmit={submit} className="login-form">
        <label htmlFor="username">Username</label>
        <input type="text" placeholder="Username" name="username" value={username} required
          onChange={e => setUsername(e.target.value)}/>
  
        <label htmlFor="email">Email</label>
        <input type="email" placeholder="email@example.net" name="email" value={email} required
          onChange={e => setEmail(e.target.value)}/>
        <label htmlFor="password">Password</label>
        <input type="password" placeholder="Password" name="password" value={password} required
          onChange={e => setPassword(e.target.value)}/>
  
        <label htmlFor="repassword">Re-enter password</label>
        <input type="password" placeholder="Repeat password" name="repassword" value={repassword} required
          onChange={e => setRepassword(e.target.value)}/>
  
        <button type="submit">Register</button>
      </form>*/}
      <div className="registration-form-error-message">{errmsg}</div>
    </div>
  )
}

/*


*/