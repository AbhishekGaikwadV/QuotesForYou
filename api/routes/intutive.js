const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
const Quote = require("../models/quotes");
const cors = require("cors");

// Configure CORS
const corsOptions = {
  origin: "https://quotes-for-you-client-eu6ep6l6o-abhishek-gaikwads-projects.vercel.app", // Replace with your frontend origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
  credentials: true // Allow cookies and other credentials
};

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
