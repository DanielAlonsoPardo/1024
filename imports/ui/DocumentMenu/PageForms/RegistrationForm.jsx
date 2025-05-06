import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';

export const RegistrationForm = ({ changeMenu }) => {
  const [username, setUsername] = useState('');
//  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [errmsg, setErrmsg] = useState('');
  const [formsent, setFormsent] = useState(false);

  const submit = e => {
    e.preventDefault();

    Accounts.createUser({ username, password })
    console.log("submitting registration form");
    setFormsent(true);
  }
  if (!formsent) {
    return (
      <div>
        <form onSubmit={submit} className="login-form">
          <label htmlFor="username">Username</label>
          <input type="text" placeholder="Username" name="username" value={username} required
            onChange={e => setUsername(e.target.value)}/>
  
{/*          <label htmlFor="email">Email</label>
          <input type="email" placeholder="email@example.net" name="email" value={email} required
            onChange={e => setEmail(e.target.value)}/>
*/}  
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
        New account created! Please login next.
        {/*Verification email sent to: {formsent}. Please login after clicking on the verification link.*/}
        <button onClick={ changeMenu("login") }>OK</button>
      </div>
    )
  }
}

/*


*/