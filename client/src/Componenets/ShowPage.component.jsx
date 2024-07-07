import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import Axios from 'axios';
import { toast } from 'react-toastify';

const ShowPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingQuotes, setLoadingQuotes] = useState(true);
  const quotesPerPage = 5;

  const [{ token }] = useContext(UserContext);

  useEffect(() => {
    const fetchQuotes = async () => {
      setLoadingQuotes(true);
      try {
        const response = await Axios.get("https://quotes-for-you-client.vercel.app/show", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setQuotes(response.data.quotes);
      } catch (error) {
        console.error('Error fetching quotes:', error);
        toast.error('Failed to fetch quotes. Please try again later.', {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoadingQuotes(false);
      }
    };

    fetchQuotes();
  }, [token]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const filteredQuotes = quotes.filter(
    quote =>
      quote.quote?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quote.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startIndex = (currentPage - 1) * quotesPerPage;
  const endIndex = currentPage * quotesPerPage;
  const currentQuotes = filteredQuotes.slice(startIndex, endIndex);

  return (
    <>
      <header id="header-show">
        Over 1000+ Quotes
      </header>
      <hr id="line" />
      <p id="title-show">All Quotes</p>
      <div id="page-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by quote or author"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div id="page-info">
          <span id="TotalPages">Total pages left: <span id="PagesLeft-1" value="1642">328</span></span>
          <span id="PageNo">Current Page No: <span id="CurrPage-1">{currentPage}</span></span>
        </div>
        <div id="content-wrap">
          {loadingQuotes ? (
            <div>Loading...</div>
          ) : (
            currentQuotes.map((quote, index) => (
              <div key={index} className="box middle center" id="cards">
                <div id='quoteandauthor'>
                  <article id="quote">"{quote.quote}" <br />
                    <p>--- {quote.author}</p>
                  </article>
                </div>
              </div>
            ))
          )}
        </div>
        <div id="page-info">
          <span id="PageNo">Current Page No: <span id="CurrPage-2">{currentPage}</span></span>
          <span id="TotalPages">Total pages left: <span id="PagesLeft-2" value="329">328</span></span>
        </div>
        <div id="navigation-buttons">
          <button type="button" className="btn btn-primary" id="button-previous" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
          <button type="button" className="btn btn-primary" id="button-next" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredQuotes.length / quotesPerPage)}>Next</button>
        </div>
      </div>
    </>
  );
}

export default ShowPage;
