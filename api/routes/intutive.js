const express = require("express");
const app     = express();
const router  = express.Router({mergeParams: true});
const Quote   = require("../models/quotes");
const cors    = require("cors");

//cors permission
app.use(cors());

//Intutive microapp Ajax //

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