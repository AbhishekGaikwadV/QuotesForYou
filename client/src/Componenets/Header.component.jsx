// Header.component.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ currentUser, onLogout }) => {
  // console.log('Current User:', currentUser); // Debug statement

  return (
    // Header section with navigation links
    <header className="header-container">
      <div className="container-fluid"> {/* Use fluid container for responsive design */}
        <h1 className='heading'>Quotes For You</h1>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav ml-auto">
            {!currentUser ? (
              // Links for non-logged-in users
              <>
                <Link className="nav-item nav-link" to="/login">Login</Link>
                <Link className="nav-item nav-link" to="/signup">Sign Up</Link>
              </>
            ) : (
              // Links for logged-in users
              <>
                <Link className="nav-item nav-link" to="/allquotes">AllQuotes</Link>
                <Link className="nav-item nav-link" to="/intuitive">IntuitiveQuote</Link>
                <Link className="nav-item nav-link" to="/moment">QuoteFortheMoment</Link>
                <Link className="nav-item nav-link" to="#" onClick={onLogout}>Logout</Link>
                <span className="navbar-text">Signed in as {currentUser.username}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
