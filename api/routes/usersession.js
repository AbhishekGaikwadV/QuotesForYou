const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { COOKIE_OPTIONS, getToken, getRefreshToken, verifyUser } = require("../authenticate");

const router = express.Router({ mergeParams: true });
const nodemailer = require('nodemailer');

// CORS configuration
app.use(cors({
  origin: '*', // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  credentials: true // if you need to include cookies in the requests
}));
app.use(express.json());

const resetPasswordSecret = process.env.RESET_PASSWORD_SECRET; // Replace with your secret key

// Generate Reset Password Token
const generateResetPasswordToken = (userId) => {
  const payload = { _id: userId };
  const secret = resetPasswordSecret;
  const options = { expiresIn: '1h' };

  return jwt.sign(payload, secret, options);
};

// Example usage
const userId = '664c6e88149642c1208c8adf'; // Replace with actual user ID
const resetToken = generateResetPasswordToken(userId);
console.log('Reset Password Token:', resetToken);

// Reset Password Route
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log('Received password reset request with token:', token); // Log token received from frontend

  try {
    const decoded = jwt.verify(token, resetPasswordSecret);

    console.log('Decoded token:', decoded); // Log decoded token data

    const user = await User.findOne({
      _id: decoded._id,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('User not found or token expired'); // Log if user not found or token expired
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Set the new password for the user
    user.setPassword(password, async (err) => {
      if (err) {
        console.error('Error setting new password:', err); // Log error if setPassword fails
        return res.status(500).json({ message: "Error resetting password" });
      }

      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      console.log('Password reset successfully'); // Log success message
      res.json({ message: "Password reset successfully" });
    });
  } catch (error) {
    console.error("Error resetting password:", error); // Log any other errors
    res.status(500).json({ message: "Internal server error" });
  }
});

// Logout Route
router.get("/logout", verifyUser, (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (!refreshToken) {
    res.status(400).send({ success: false, message: "Refresh token not provided" });
    return;
  }

  User.findById(req.user._id)
    .then(user => {
      const tokenIndex = user.refreshToken.findIndex(
        item => item.refreshToken === refreshToken
      );

      if (tokenIndex !== -1) {
        user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
      }

      user.save(err => {
        if (err) {
          res.status(500).json({ success: false, message: err.message });
        } else {
          res.clearCookie("refreshToken", COOKIE_OPTIONS);
          res.json({ success: true, message: "Logged out successfully" });
        }
      });
    })
    .catch(err => {
      next(err);
    });
});

// Get User Profile Route
router.get("/me", verifyUser, (req, res) => {
  res.send(req.user);
});

// Refresh Token Route
router.post("/refreshToken", verifyUser, async (req, res) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const userId = payload._id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(401).send("Unauthorized");
      return;
    }

    const tokenIndex = user.refreshToken.findIndex(item => item.refreshToken === refreshToken);

    if (tokenIndex === -1) {
      res.status(401).send("Unauthorized");
      return;
    }

    const token = getToken({ _id: userId });
    const newRefreshToken = getRefreshToken({ _id: userId });
    user.refreshToken[tokenIndex] = { refreshToken: newRefreshToken };

    await user.save();

    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.send({ success: true, token, user });
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
});

// Login Route
router.post("/login", passport.authenticate("local"), async (req, res, next) => {
  try {
    const token = getToken({ _id: req.user._id });
    const refreshToken = getRefreshToken({ _id: req.user._id });
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.refreshToken.push({ refreshToken });
    await user.save();

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.send({ success: true, token });
  } catch (error) {
    next(error);
  }
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    if (!req.body.firstName) {
      throw new Error("The first name is required");
    }

    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      throw new Error("User with this username already exists");
    }

    const newUser = new User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName || "",
    });

    const user = await User.register(newUser, req.body.password);
    const token = getToken({ _id: user._id });
    const refreshToken = getRefreshToken({ _id: user._id });

    user.refreshToken.push({ refreshToken });
    await user.save();

    const savedUser = await User.findById(user._id);

    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.send({ success: true, token, user: savedUser });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

module.exports = router;
