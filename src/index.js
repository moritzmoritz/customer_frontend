import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from "@auth0/auth0-react";
import { domain, clientId } from './constants';

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={ domain }
      clientId={ clientId }
      redirectUri={ window.location.origin }
      useRefreshTokens={ true }
      cacheLocation="localstorage"
      audience="https://staging.flytternu.io"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
