import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const QuoteFTM = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  // Create an Axios instance for API requests
  const apiClient = Axios.create({
    baseURL: 'https://quotes-for-you-a.vercel.app',
    withCredentials: true, // if you need to include cookies
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });

  useEffect(() => {
    // Function to fetch a quote from the server
    const fetchQuote = async () => {
      try {
        const response = await apiClient.get('/');
        const { quote, author } = response.data;
        setQuote(quote);
        setAuthor(author);
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchQuote(); // Fetch quote immediately when component mounts

    const intervalId = setInterval(() => {
      fetchQuote(); // Fetch quote every 20 seconds
    }, 20000);

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [apiClient]);

  return (
    <div className="intuitive-container">
      <div className="container" id="index-container">
        <div className="title_Quote_FTM">Quote for this moment</div>
        <div className="quote-card">
          <div className="quote-text">"{quote}"</div>
          <div className="quote-author">--- {author}</div>
        </div>
      </div>
    </div>
  );
};

export default QuoteFTM;
