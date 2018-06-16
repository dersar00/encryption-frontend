import React from 'react';
import ReactFileReader from 'react-file-reader';

export const EncryptForm = (props) => (
  <div className="App">
    <form enctype="multipart/form-data" onSubmit = {props.sendEncrypted}>
      <input id="file" type="file" onChange={props.encrypt}/>
      <input type="submit" value="Encrypt & Send" />
    </form>
    <p id="crypt_key"></p>
  </div>
)
