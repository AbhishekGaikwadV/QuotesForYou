const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

// Define a sub-schema for sessions to store refresh tokens and password reset tokens
const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
  resetPasswordExpires: {
    type: Date,
  },
});

// Define the main User schema
const User = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  authStrategy: {
    type: String,
    default: "local",
  },
  points: {
    type: Number,
    default: 50,
  },
  refreshToken: {
    type: [Session],
  },
});

// Remove sensitive fields from the response when converting to JSON
User.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.refreshToken;
    return ret;
  },
});

// Plugin to add passport-local-mongoose methods to the User schema
User.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", User);
