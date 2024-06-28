// MainPage.js
import React, { useEffect } from 'react';
import Header from './Header.component.jsx';
import Footer from './Footer.component.jsx';

const MainPage = ({ quote, author }) => {
  useEffect(() => {
    // Auto-reload the page every 20 seconds
    const interval = setInterval(() => {
      window.location.reload(true);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header />
      <div className="jumbotron jumbotron-fluid" id="jumbotron">
        <div className="container" id="index-container">
          <h1 className="title" id="index-title">QuotesForYou</h1>
          <p className="lead" id="index-lead">
            <a href="/signup">Signup</a> or <a href="/login">Login</a> to get access to all quotes.
          </p>
        </div>

        <div id="title">Quote for this moment is</div>
        <div className="box middle center" id="card-index">
          <div id='quoteandauthor'>
            <article id="quote">"{quote}"<br />
              <span id="author"> --- {author} </span>
            </article>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainPage;
