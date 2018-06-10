import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SignInForm, SignUpForm} from './components';

class App extends Component {
  state = {
    signedUp: true
  }

  signIn = () => {
    alert("SignedIn")
  }

  signUp = () => {
    alert("SignedUP")
  }


  accaunt = () => {
    this.setState({signedUp: !this.state.signedUp})
  }
  render() {
    if(this.state.signedUp){
      return (
        <div className="App">
          <SignInForm signIn={this.signIn}/>
          <button onClick={this.accaunt}>Sign Up</button>
        </div>
      );
      } else {
        return(
          <div className="App">
            <SignUpForm signUp={this.signUp}/>
            <button onClick={this.accaunt}>Already have accaunt?</button>
          </div>
        );
      }

  }
}

export default App;
