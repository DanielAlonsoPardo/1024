import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [errmsg, setErrmsg] = useState('');
  const [formsent, setFormsent] = useState('');

  const submit = e => {
    e.preventDefault();
    console.log("submitting registration form");
    setFormsent(email);
  }
  if (!formsent) {
    return (
      <div>
        <form onSubmit={submit} className="login-form">
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
        </form>
        <div className="registration-form-error-message">{errmsg}</div>
      </div>
    )
  } else {
    return (
      <div>
        Verification email sent to: {formsent}. Please login after clicking on the verification link.
        <button onClick={ () => setFormsent("") }>OK</button>
      </div>
    )
  }
}

/*


*/