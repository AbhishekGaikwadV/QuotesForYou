// authenticate.js
require('dotenv').config();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dev = process.env.NODE_ENV !== "production";
const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;

console.log('REFRESH_TOKEN_EXPIRY in authenticate.js:', refreshTokenExpiry);

exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: !dev, // Use secure cookies in production
  signed: true,
  maxAge: validateMaxAge(process.env.REFRESH_TOKEN_EXPIRY),
  sameSite: "none"
};

function validateMaxAge(maxAgeValue) {
  const maxAge = Number(maxAgeValue);
  if (isNaN(maxAge) || maxAge <= 0) {
    console.error("Invalid maxAge value in COOKIE_OPTIONS. Using default value.");
  }
  return maxAge;
}

// Log the value of REFRESH_TOKEN_EXPIRY
console.log('REFRESH_TOKEN_EXPIRY', refreshTokenExpiry);

exports.getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY)
  });
};

exports.getRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY)
  });
  return refreshToken;
};

exports.verifyUser = passport.authenticate("jwt", { session: false });