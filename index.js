if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}


const express = require('express')
const app = express();
const mongoose = require('mongoose')
const path = require('path');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
app.use(express.static('public'));
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./modals/user')

mongoose.connect(process.env.MONGO_URL )
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

    const mainRoutes = require('./routes/mainRoutes');
    const userRoutes = require('./routes/userRoutes');
    const artRoutes = require('./routes/artRoutes');
    const foodRoutes = require('./routes/foodRoutes');
    const sportRoutes = require('./routes/sportRoutes');
    const travelRoutes = require('./routes/travelRoutes');
    const messageRoutes = require('./routes/messageRoutes')
    
    


app.engine('ejs' , ejsMate);
// telling express that we want to use ejsMate instead of default one its relying on
app.set('views' , path.join(__dirname,'views'));
app.set('view engine' , 'ejs');
app.use(express.static('public'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended : true}))
app.use(session({
    secret: 'thisshouldbeabettersecret!', // You should replace this with a secure, random string in a production app
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true if using HTTPS
}));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.use((req , res , next)=>{
    res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error')
   next();
})




// Use the routes
app.use('/main', mainRoutes); // Main routes for the homepage or general routes
app.use('/users', userRoutes); // Routes for user-related pages
app.use('/arts', artRoutes); // Routes for art-related pages
app.use('/food', foodRoutes); // Routes for food-related pages
app.use('/sport', sportRoutes); // Routes for sports-related pages
app.use('/travel', travelRoutes); // Routes for travel-related pages
app.use('/message' , messageRoutes)
// console.log(mainRoutes); // Should log a router object
// console.log(userRoutes);
// console.log(artRoutes);
// console.log(foodRoutes);
// console.log(sportRoutes);
// console.log(travelRoutes);



app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError('Page Not Found' , 404))
 })

 app.use((err,req,res,next)=>{
     const { statusCode = 500 } = err;
     if(!err.message) err.message = "Oh no something went wrong!";
     res.status(statusCode).render('error' , {err} );
 })

app.listen(3000 , ()=>{
    console.log('on port 3000')
})