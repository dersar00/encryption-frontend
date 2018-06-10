import React from 'react';

export const SignInForm = (props) =>(
  <form onSubmit = {props.signIn}>
    <h2>Sign In</h2>
    <input
      name="email"
      id="email"
      type="email"
      placeholder="Email..."
    />
    <br/>
    <input
      name="password"
      id="password"
      type="password"
      placeholder = "Password"
    />
    <br />
    <input type="submit" value="Sign in"/>
  </form>
)
