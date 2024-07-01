import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './context/UserContext.jsx'; // Ensure there's a space between from and './context/UserContext.jsx'
import reportWebVitals from './reportWebVitals';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
reportWebVitals();
root.render(
  <React.StrictMode>
      <Router>
    <UserProvider>
        <App />
    </UserProvider>
      </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
