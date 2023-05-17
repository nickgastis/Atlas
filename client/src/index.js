
import React from 'react';
import './index.css'
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth0Provider } from "@auth0/auth0-react";


ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Auth0Provider
        domain="dev-fxjbmegke1ksv11l.us.auth0.com"
        clientId="95mzjyYOQ0W3MYsCh6U2N2vkp1wbeR0G"
        authorizationParams={{
          redirect_uri: window.location.origin
        }}
      >
        <App />
      </Auth0Provider>,
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
