import React from 'react';

export const SignUpForm = (props) => (
  <form onSubmit = {props.signUp}>
  <h2>Sign Up</h2>
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
  <input
    name="confirm"
    id="confirm"
    type="password"
    placeholder = "Confirm password"
  />
  <br />
  <input type="submit" value="Sign up"/>
  </form>
)
