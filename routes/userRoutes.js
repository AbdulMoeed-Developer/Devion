const express = require('express');
const { storeReturnTo } = require('../middleware');
const User = require('../modals/user');
const passport = require('passport');
const router = express.Router();

router.get('/loginForm' , (req,res)=>{
    res.render('users/login')
})

router.get('/signUpForm' , (req,res)=>{
    res.render('users/SignUp')
})
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/main');
    });
}); 

router.post('/signUpForm' , async (req , res , next)=>{
    try { 
    const {email , username , password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user , password);
    req.login(registeredUser , err => {
        if(err) return next(err);
        req.flash('success','Welcome')
        res.redirect('/main')
    })
    console.log(req.body)
    } catch(e){
        req.flash('error' , e.message)
        res.redirect('/users/signUpForm')
    }
   
})

router.post('/loginForm' ,storeReturnTo, passport.authenticate('local', {failureFlash:true , failureRedirect:'/users/loginForm'}), (req , res) =>{
req.flash('success' , 'Welcome Back')
const redirectUrl = res.locals.returnTo || '/main';
delete req.session.returnTo;
res.redirect(redirectUrl);
})
// router.get('/register' , async (req,res) =>{
//     const user = new User({email: "meee@gmail.com" , username:"meeee"})
//     const newUser = await User.register(user , 'chicken')
//     res.send(newUser)
// })

module.exports = router;