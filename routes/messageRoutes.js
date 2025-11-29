const express = require('express');
const router = express.Router();
const Message = require('../modals/message')
const {isLoggedIn , isMessageAuthor } = require("../middleware")

const session = require('express-session')
const flash = require('connect-flash')

router.get('/', async (req,res)=>{
    const allMsg = await Message.find().populate('user');;
    res.render('app/message' , {allMsg})
})
router.get('/show/:id' ,isLoggedIn, async (req,res)=>{
    const {id} = req.params;
    const msg = await Message.findById(id).populate('user'); // Populate the 'user' field with user details
    res.render('app/show' , {msg , currentUser: req.user} )
})
router.post('/', isLoggedIn, async (req, res) => {
    console.log(req.user); 
    const { msg } = req.body;
    const newMsg = new Message({
        msg,
        user: req.user._id  // Ensure req.user is defined
    });
    await newMsg.save();
    res.redirect('/message');
});


router.delete('/:id', isMessageAuthor , async (req, res) => {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.redirect('/message');
});

module.exports = router;

