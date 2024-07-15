const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const Quote = require("../models/quotes");
const cors = require("cors");

// Configure CORS
const allowedOrigins = [
    'https://quotes-for-you-client.vercel.app',
    'https://quotes-for-you-client-eu6ep6l6o-abhishek-gaikwads-projects.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    credentials: true // Include cookies in the requests
}));

// Set Access-Control-Allow-Origin header
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Home Route - Fetch a random quote
router.get("/", async (req, res) => {
    const que = Math.round(Math.random() * 1601);

    try {
        const data = await Quote.findOne({ num: que });

        if (data) {
            res.setHeader("Content-Type", "application/json");
            res.json({
                quote: data.quote,
                author: data.author
            });
        } else {
            console.log("No data found");
            res.status(404).json({ error: "No data found" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Show Route - Fetch all quotes
router.get("/show", async (req, res) => {
    try {
        const quotes = await Quote.find({});

        if (quotes.length > 0) {
            res.setHeader("Content-Type", "application/json");
            res.json({
                quotes: quotes.map(quote => ({
                    quote: quote.quote,
                    author: quote.author
                }))
            });
        } else {
            console.log("No data found");
            res.status(404).json({ error: "No data found" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Intuitive microapp Ajax - Fetch a random quote for a microapp
router.get("/microapp", async (req, res) => {
    try {
        const que = Math.round(Math.random() * 1601);
        const quote = await Quote.findOne({ num: que });

        if (quote) {
            res.setHeader("Content-Type", "application/json");
            res.json({
                quote: quote.quote,
                author: quote.author
            });
        } else {
            console.log("No data found");
            res.status(404).json({ error: "No data found" });
        }
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
