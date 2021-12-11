/* eslint-disable no-alert */
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../style/Contact.css';
import ToolBar from './Toolbar';
import NavigationMenu from './NavigationMenu';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const submit = () => {
    if (name && email && message) {
      const serviceId = `${process.env.REACT_APP_SERVICE_ID}`;
      const templateId = `${process.env.REACT_APP_TEMPLATE_ID}`;
      const userId = `${process.env.REACT_APP_USER_ID}`;
      const templateParams = {
        name,
        email,
        message,
      };

      emailjs.send(serviceId, templateId, templateParams, userId);

      setName('');
      setEmail('');
      setMessage('');
      alert('Thank you for your message, we will be in touch in no time.');
    } else {
      alert('Please fill in all fields!');
    }
  };

  return (
    <div className="Contact">
      <div className="container p-0">
        <ToolBar />
        <div className="container-fluid">
          <div className="row">
            <NavigationMenu />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 movie_list">
              <div className="pt-8 pb-2 mb-3 border-bottom">
                <div className="row">
                  <h1>Contacts</h1>
                </div>
                <div className="iq-card-body">
                  <div className="form-group">
                    <div>Full Name</div>
                    <input type="text" className="full-name form-control" placeholder="Your Full Name" value={name} onChange={(event) => setName(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <div>Email Address</div>
                    <input type="email" className="email-address form-control" placeholder="Your Email Address" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </div>
                  <div className="form-group">
                    <div>Message</div>
                    <textarea className="message form-control" rows="3" placeholder="Your Message" value={message} onChange={(event) => setMessage(event.target.value)} />
                  </div>
                  <button type="button" className="btn btn-primary" onClick={submit}>Send Message</button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
