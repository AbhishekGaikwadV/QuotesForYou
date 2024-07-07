const express = require("express");
const router = express.Router({ mergeParams: true });
const Quote = require("../models/quotes");
const cors = require("cors");

// Configure CORS
app.use(cors({
    origin: ['https://quotes-for-you-client.vercel.app', 'https://quotes-for-you-client-eu6ep6l6o-abhishek-gaikwads-projects.vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
    credentials: true // Include cookies in the requests
  }));

  // Set Access-Control-Allow-Origin header
app.use((req, res, next) => {
    const allowedOrigins = ['https://quotes-for-you-client.vercel.app', 'https://quotes-for-you-client-eu6ep6l6o-abhishek-gaikwads-projects.vercel.app'];
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
            res.json(data);
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
            res.json({ quotes });
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

        res.setHeader("Content-Type", "application/json");
        res.json(quote);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
