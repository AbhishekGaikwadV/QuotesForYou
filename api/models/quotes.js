const mongoose = require("mongoose");

// Define the schema for quotes
const quotesSchema = new mongoose.Schema({
    num: Number,      // Number assigned to the quote
    quote: String,    // Text of the quote
    author: String    // Author of the quote
});

// Export the Quote model
module.exports = mongoose.model("Quote", quotesSchema);
