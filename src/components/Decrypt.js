import React from 'react';

export const DecryptForm = (props) => (
  <div>
    <label>Choose file</label>
    <br />
    <input type="file" onChange={props.decrypt}/>
    <br />
    <label>Enter encryption key</label>
    <br />
    <input type="field" id="decrypt_pass" />
    <a id="decrypt_download" onClick={props.decrypt}>Decrypt & Download</a>
  </div>
)
