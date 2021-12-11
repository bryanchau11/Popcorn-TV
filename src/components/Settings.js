/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import '../style/Settings.css';
import ToolBar from './Toolbar';
import NavigationMenu from './NavigationMenu';

function Settings() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState('');

  useEffect(() => {
    fetch('/get_username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json()).then((data) => {
      setName(data.username);
    });
  }, []);

  const change = () => {
    if (name) {
      if (password === passwordVerify) {
        fetch('/change_settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ new_username: name, new_password: password }),
        }).then((response) => response.json()).then((data) => {
          setName(data.change);
          setPassword('');
          setPasswordVerify('');
          alert('Data has been updated successfully.');
        });
      } else {
        alert('Passwords do not match!');
      }
    } else {
      alert('Please fill in full name field!');
    }
  };

  return (
    <div className="Settings">
      <div className="container p-0">
        <ToolBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list">
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1>Settings</h1>
                </div>
                <div className="iq-card-body">
                  <div className="form-group">
                    <div>Full Name</div>
                    <input type="text" className="full-name form-control" value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <div>New Password</div>
                    <input type="password" className="password form-control" value={password} onChange={(event) => setPassword(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <div>Verify Password</div>
                    <input type="password" className="password-verify form-control" value={passwordVerify} onChange={(event) => setPasswordVerify(event.target.value)} />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={change}>Submit</button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
