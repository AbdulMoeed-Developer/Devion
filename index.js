if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const { MongoStore } = require("connect-mongo");
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./modals/user');

// 🔹 Mongo
mongoose.connect(process.env.MONGO_URL, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("CONNECTION OPEN!!!"))
.catch(err => console.log(err));

// 🔹 View engine
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 🔹 Middleware
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

// 🔹 Session store
const store = MongoStore.create({
  mongoUrl: process.env.MONGO_URL,
  touchAfter: 24 * 3600,
  crypto: {
    secret: process.env.SESSION_SECRET
  }
});

app.use(session({
  store,
  name: "session",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

app.use(flash());

// 🔹 Passport (ORDER MATTERS)
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

// 🔹 Routes
app.use('/main', require('./routes/mainRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/arts', require('./routes/artRoutes'));
app.use('/food', require('./routes/foodRoutes'));
app.use('/sport', require('./routes/sportRoutes'));
app.use('/travel', require('./routes/travelRoutes'));
app.use('/message', require('./routes/messageRoutes'));

app.get("/", (req, res) => {
  res.redirect("/main");
});

// 🔹 404
app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// 🔹 Error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong!";
  res.status(statusCode).render('error', { err });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
