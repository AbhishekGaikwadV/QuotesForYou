// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const index = require("./routes/index");
const usersession = require("./routes/usersession");
const intuitive = require("./routes/intutive");
const bodyParser = require("body-parser");
const User = require("./models/users");
const Quote = require("./models/quotes");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const passportLocalMongoose = require("passport-local-mongoose");
const middlewares = require("./routes/middlewares");
const cors = require('cors');

// Database connection setup
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://HBQAdmin:12345@cluster0.xgorc.mongodb.net/quotesv1');
}

// Listen for connection events
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

// Require authenticate.js and JWTStrategy after loading environment variables
require("./authenticate");
require("./JWTStrategy");

// Passport configuration
app.use(require("express-session")({
    secret: "Live life to the fullest",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Called during login/sign up
passport.use(new LocalStrategy(User.authenticate()));

// Called after logging in/signing up to set user details in req.user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Define CORS options
app.use(cors({
    origin: 'https://quotes-for-you-client.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // if you need to include cookies in the requests
  }));
  



// Parse JSON bodies
app.use(bodyParser.json());

// Parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// Routes declaration
app.use(usersession);
app.use(index);
app.use(intuitive);


// Server setup
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log("The QuotesForYou Server Has Started!");
});
