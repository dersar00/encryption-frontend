import React from 'react';

export const LoginForm = (props) =>(
  <form onSubmit={this.login}>
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
    <input type="submit" value="Login"/>
  </form>
)
