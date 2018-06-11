import React from 'react';

export const TransferForm = (props) => (
  <div className="App">
    <form enctype="multipart/form-data" action="/upload/image" method="post">
      <input id="image-file" type="file" onChange = {props.encrypt} />
    </form>
    <p id="crypt_key"></p>
    <br/>
    <input type = "field" id="decrypt_key" placeholder = "Decryption key"/>
    <input type="button" value="Decrypt" onClick={props.decrypt} />
    <p id="start_message"></p>
  </div>
)
