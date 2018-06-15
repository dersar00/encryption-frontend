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
    loggedIn: this.authTokenExists(),
    encrypted: "",
    hash: "",
    filename: "",
    encrypted_list: [],
    render_decrypt: false,
    decrypt_file_id: ""
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

    var file = e.target.files[0];
    var reader = new FileReader();
    var uuid = "123456"//uuidv4();
    var show_key = document.getElementById('crypt_key')
    console.log(uuid);

    if(e.target.files.length!=1){
      alert('Please select a file to decrypt!');
      return false;
    }

    reader.onload = (e) => {


      var hash = CryptoJS.SHA256(reader.result).toString(CryptoJS.enc.Hex);
      console.log(file.name);
      console.log("HASH - " + hash);
      console.log(reader.result);

      var encrypted = CryptoJS.AES.encrypt(reader.result, uuid);
      this.setState({encrypted: reader.result, hash: hash, filename: file.name})
      console.log("ENCRYPTED");
      console.log(encrypted);



      var a = document.getElementById('download')


      //a.setAttribute('href', 'data:application/octet-stream,' + encrypted);
      //a.setAttribute('download', file.name + '.encrypted');

      //var qq = 'data:application/octet-stream,' + encrypted

      //console.log("QQ\n\n\n");
      //console.log(qq);
      //console.log("UUID \n\n\n\n\n" + uuid + "\n\n\n\n");
      //var decrypted = CryptoJS.AES.decrypt(qq, uuid);
      //console.log("DECRYPTED");
      //console.log(decrypted.toString(CryptoJS.enc.Latin1));

      //this.setState({encrypted: encrypted, hash: hash, filename: file.name})

      show_key.innerHTML = "Decryption key for receiver: " + uuid
    };
    //console.log("HERERERERERERERE\n\n\n" + e.target.result + "\n\n\nDSADSADASDASDASDS");

    reader.readAsDataURL(file);

  }

  decrypt = () => {

    alert("decrypt clicked")
    //var decrypted = CryptoJS.AES.decrypt(this.state.encrypted, "123456");
    //console.log(this.state.encrypted);
    //console.log(decrypted.toString(CryptoJS.enc.Latin1));

  }


  send_encrypted = (e) => {

    if (this.state.encrypted != ""){
      e.preventDefault()


      const headers = {'X-USER-TOKEN': localStorage.getItem('authentication_token'), 'X-USER-EMAIL': localStorage.getItem('email')}
      const data = {"encrypted_file": {"file": this.state.encrypted, "file_name": this.state.filename, "file_hash": this.state.hash, "user_email": localStorage.getItem('email')}}

      axios.post("http://localhost:3001/api/encrypted_files", data, {headers: headers})
      .then((response) => {
        console.log("RESPONSE DATA");
        console.log(response.data.encrypted_files.length);
        this.setState({encrypted_list: response.data.encrypted_files})


        for(var i = 0; i < response.data.encrypted_files.length; i++){
           var ul = document.getElementById("encrypted-list");
           var li = document.createElement("li")
           var content = "<p>" + response.data.encrypted_files[i].file_name + "</p>" + "  -  " + "<label>" + response.data.encrypted_files[i].user_email + "</label>"
           li.innerHTML = content
           ul.appendChild(li)
           li.setAttribute("class", "encr")
           document.getElementById('encrypted-list').childNodes[i].childNodes[0].setAttribute("id", i)

           //document.getElementById('encrypted-list').childNodes[i].setAttribute("onclick","javascript:doit();");
        }

        document.getElementById('encrypted-list').onclick = (e) =>{
          console.log(e.target.id);
          this.setState({render_decrypt: !this.state.render_decrypt, decrypt_file_id: e.target.id})
        }

      })
      .catch((error) => {
      })
    } else {
      alert("choose some file for encryption");
    }

    }

    render_login = () => {
      this.setState({render_decrypt: !this.state.render_decrypt})
    }

    //componentDidMount = () => {
    //  alert('ok')
    //  document.getElementsByTagName('P').onclick = function (e) {

    //    console.log(e.target.id);

    //  }
    //}

    accaunt = () => {
      this.setState({signedUp: !this.state.signedUp})
    }
    render() {
      if(!this.state.render_decrypt){
      if(this.state.loggedIn){
        return(
          <div>
            <div className="View">
              <div className="encrypt">
                <h1>Encrypt File</h1>
                <EncryptForm encrypt={this.encrypt} sendEncrypted={this.send_encrypted}/>
              </div>
              <div className="files-list">
                <h1>Files</h1>
                <ul id="encrypted-list" className="encr">

                </ul>
              </div>
              <a id="download" onClick = {this.decrypt}>dowbload</a>
            </div>
            <button onClick={this.logout}>Logout</button>
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
    } else{
      return (
        <div>
          <DecryptForm decrypt={this.decrypt} />
          <button onClick={this.render_login}>Go Back</button>
        </div>
      )
    }
  }
}

export default App;
