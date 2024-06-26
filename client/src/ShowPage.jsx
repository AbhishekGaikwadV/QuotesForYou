import React from 'react';

const ShowPage = ({ quotes }) => {
    return (
        <>
            <header id="header-show">
                Over 3000+ Quotes
            </header>
            <hr id="line" />
            <br />
            <p id="title-show">All Quotes</p>
            <div id="page-container">
                <span id="TotalPages">Total pages left: <span id="PagesLeft-1" value="1642"> 328</span></span>
                <br /><br /><br /><br />
                <span id="PageNo">Current Page No: <span id="CurrPage-1"> 1</span></span>
                <br /><br /><br /> <br />
                <div id="content-wrap">
                    {quotes && quotes.slice(0, 5).map((quote, index) => (
                        <div className="box middle center" id="cards" key={index}>
                            <div id='quoteandauthor'>
                                <article id="quote">"{quote.quote}"<br />
                                    <p> --- {quote.author} </p>
                                </article>
                            </div>
                        </div>
                    ))}
                </div>
                <span id="PageNo">Current Page No: <span id="CurrPage-2"> 1</span></span>
                <br /><br /><br /> <br />
                <span id="TotalPages">Total pages left: <span id="PagesLeft-2" value="329"> 328</span></span>
                <br /><br /><br /><br />
                <button type="button" className="btn btn-primary" id="button-previous" value='0'>Previous</button>
                <button type="button" className="btn btn-primary" id="button-next" value='2'>Next</button>
            </div>
            <script async src="/ajax.js"></script>
        </>
    );
}

export default ShowPage;
