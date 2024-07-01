// Intuitive.js
import React, { useState } from 'react';
import Axios from 'axios';
import { Card, Button } from "@blueprintjs/core";

const Intuitive = () => {
  const [quote, setQuote] = useState(null);
  const [author, setAuthor] = useState(null);

  const fetchQuote = () => {
    // Fetch a random quote from the server
    Axios.get("https://quotes-for-you-a.vercel.app/microapp", {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => {
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not in JSON format');
        }
        setQuote(response.data.quote);
        setAuthor(response.data.author);
      })
      .catch(error => {
        console.error('Error fetching the quote:', error);
      });
  };

  return (
    <div className="intuitive-container">
      <Card className="quote-card" elevation="2">
        {quote ? (
          // Display the fetched quote
          <>
            <p className="quote-text">{quote}</p>
            <p className="quote-author">- {author}</p>
          </>
        ) : (
          // Prompt the user to fetch a quote
          <p>Press the button to get a random quote!</p>
        )}
      </Card>
      <div className="button-container">
        <Button className="fetch-button" onClick={fetchQuote}>Get a Random Quote</Button>
      </div>
    </div>
  );
};

export default Intuitive;
