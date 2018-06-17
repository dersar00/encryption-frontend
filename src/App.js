import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {SignInForm, SignUpForm, EncryptForm, DecryptForm,DownloadEncryptForm} from './components';
import axios from 'axios';
const CryptoJS = require("crypto-js");
const uuidv4 = require('uuid/v4');

class App extends Component {
  state = {
    signedUp: true,
    loggedIn: this.authTokenExists(),
    encrypted: "",
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
    var uuid = uuidv4();
    var show_key = document.getElementById('crypt_key')
    console.log(uuid);

    if(e.target.files.length!=1){
      alert('Please select a file to decrypt!');
      return false;
    }

    reader.onload = (e) => {



      var encrypted = CryptoJS.AES.encrypt(e.target.result, uuid);
      this.setState({encrypted: encrypted,  filename: file.name})

      show_key.innerHTML = "Decryption key for receiver: " + uuid
    };

    reader.readAsDataURL(file);

  }

  download_decrypted = () => {

    var a = document.getElementById('download')

    a.setAttribute("href", 'data:application/octet-stream,' + this.state.encrypted_list[this.state.decrypt_file_id].file)
    a.setAttribute('download', this.state.encrypted_list[this.state.decrypt_file_id].file_name + '.encrypted')

  }

  decrypt = (e) => {
    var password = document.getElementById('decrypt_pass').value
    var a = document.getElementById('decrypt_download')
    if(e.target.id == ""){
      e.preventDefault()

      var file = e.target.files[0];
      this.setState({file_name: file.name})
      var reader = new FileReader();

      if(e.target.files.length!=1){
        alert('Please select a file to decrypt!');
        return false;
      }

      reader.onload = (e) => {
        this.setState({encrypted: reader.result})

      };

      reader.readAsText(file);
    } else{
      if (password != ""){
        console.log(this.state.encrypted);
        var decrypted = CryptoJS.AES.decrypt(this.state.encrypted, password)
                    .toString(CryptoJS.enc.Latin1);

        if(!/^data:/.test(decrypted)){
					alert("Invalid pass phrase or file! Please try again.");
					return false;
				}

				a.setAttribute('href', decrypted);
				a.setAttribute('download', this.state.file_name.replace('.encrypted',''));
      } else {
        alert("ENTER DECRYPT PASSWORD")
      }
    }
  }


  send_encrypted = (e) => {

    if (this.state.encrypted != ""){
      e.preventDefault()



      const headers = {'X-USER-TOKEN': localStorage.getItem('authentication_token'), 'X-USER-EMAIL': localStorage.getItem('email')}
      const data = {"encrypted_file": {"file": this.state.encrypted.toString(), "file_name": this.state.filename, "user_email": localStorage.getItem('email')}}


      axios.post("http://localhost:3001/api/encrypted_files", data, {headers: headers})
      .then((response) => {
        this.setState({encrypted_list: response.data.encrypted_files})


        for(var i = 0; i < response.data.encrypted_files.length; i++){
           var ul = document.getElementById("encrypted-list");
           var li = document.createElement("li")
           var content = "<p>" + response.data.encrypted_files[i].file_name + "</p>" + "  -  " + "<label>" + response.data.encrypted_files[i].user_email + "</label>"
           li.innerHTML = content
           ul.appendChild(li)
           li.setAttribute("class", "encr")
           document.getElementById('encrypted-list').childNodes[i].childNodes[0].setAttribute("id", i)

        }

        document.getElementById('encrypted-list').onclick = (e) =>{
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


    accaunt = () => {
      this.setState({signedUp: !this.state.signedUp})
    }
    render() {
      if(!this.state.render_decrypt){
      if(this.state.loggedIn){
        return(
          <div>
            <div className="View">
              <div className="left">
                <h1>Encrypt File</h1>
                <EncryptForm encrypt={this.encrypt} sendEncrypted={this.send_encrypted}/>
              </div>
              <div className="right">
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
          <div className="View">
            <div className="left">
              <h1>Download decrypted file</h1>
                <DownloadEncryptForm download_decrypted={this.download_decrypted} />
            </div>
            <div className="right">
              <h1>Encrypt File</h1>
                <DecryptForm decrypt={this.decrypt} />
            </div>
          </div>
          <button onClick={this.logout}>Logout</button>
          <button onClick={this.render_login}>Go Back</button>
        </div>
      )
    }
  }
}

export default App;
