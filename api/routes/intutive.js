const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const Quote = require("../models/quotes");
const cors = require("cors");

// CORS configuration
app.use(cors({
  origin: 'https://quotes-for-you-client.vercel.app', // Allow specific origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  credentials: true // Include cookies in the requests
}));

// Intuitive microapp Ajax
router.get("/microapp", async (req, res) => {
  try {
    const que = Math.round(Math.random() * 1601);
    
    const quote = await Quote.findOne({ num: que });
    res.setHeader("Content-Type", "application/json");
    res.json(quote);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
