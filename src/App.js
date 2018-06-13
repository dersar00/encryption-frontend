import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SignInForm, SignUpForm, EncryptForm, DecryptForm} from './components';
import axios from 'axios';
const CryptoJS = require("crypto-js");
const uuidv4 = require('uuid/v4');

class App extends Component {
  state = {
    signedUp: true,
    loggedIn: this.authTokenExists()
  }

  signIn = (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const request = {"user": {"email": email, "password": password}}
    console.log(request)
    axios.post("http://localhost:3001/api/sign_in", request)
      .then((response) => {
        console.log(response);
        localStorage.setItem('authentication_token', response.data.authentication_token);
        localStorage.setItem('email', response.data.email);
        this.setState({loggedIn: !this.loggedIn})
        //this.showMessage(response.data.msg)
      })
      .catch((error) => {
        console.log(error);
        console.log(error.response);
        //this.showError(error.response.data.error)
      })
  }

  signUp = (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const password_confirmation = document.getElementById('confirm').value
    const request = {"user": {"email": email, "password": password, "password_confirmation": password_confirmation}}
    console.log(request)
    axios.post("http://localhost:3001/api/sign_up", request)
      .then((response) => {
        console.log(response);
        localStorage.setItem('authentication_token', response.data.authentication_token);
        localStorage.setItem('email', response.data.email);

        this.setState({loggedIn: !this.loggedIn})
        //this.showMessage(response.data.msg)
      })
      .catch((error) => {
        console.log(error.response);
        //this.showError(error.response.data.error)
      })
  }

  logout = () => {
    const headers = {'X-USER-TOKEN': localStorage.getItem('authentication_token'), 'X-USER-EMAIL': localStorage.getItem('email')}
    axios.delete("http://localhost:3001/api/sign_out", {headers: headers})
     .then((response) => {
       console.log(response)
       localStorage.removeItem('authentication_token')
       localStorage.removeItem('email')
       this.setState({loggedIn: false})
       this.setState({tokens: []})
     })
  }

  authTokenExists () {
    if("authentication_token" in localStorage) {
      return true
    } else {
      return false
    }
  }

  encrypt = (e) => {
    e.preventDefault()

    var file = ""
    var reader = new FileReader();
    var uuid = uuidv4();
    var show_key = document.getElementById('crypt_key')
    console.log(uuid);

    if(e.target.files.length!=1){
      alert('Please select a file to decrypt!');
      return false;
    }


    file = e.target.files[0];
    console.log(file);

    reader.onload = function(e){

      //console.log("HERERERERERERERE\n\n\n" + e.target.result + "\n\n\nDSADSADASDASDASDS");
      var hash = CryptoJS.SHA256(e.target.result).toString(CryptoJS.enc.Hex);
      console.log("HASH - " + hash);
      var encrypted = CryptoJS.AES.encrypt(e.target.result, uuid);

      console.log(encrypted);
      show_key.innerHTML = "Decryption key for receiver: " + uuid
    };

    reader.readAsDataURL(file);



  }

  decrypt = () => {
    alert("decrypt clicked")
  }

  accaunt = () => {
    this.setState({signedUp: !this.state.signedUp})
  }
  render() {
    if(this.state.loggedIn){
      return(
        <div className="View">
          <div className="encrypt">
            <h1>Encrypt File</h1>
            <EncryptForm encrypt={this.encrypt} />
          </div>
          <div className="files-list">
            <h1>Files</h1>
          </div>
        </div>
      )
    } else if(this.state.signedUp){
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
