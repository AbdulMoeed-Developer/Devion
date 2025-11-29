const express = require('express');
const router = express.Router();
const {FoodImage} = require('../modals/image')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage });

router.get('/', async (req,res)=>{
    const foodImages = await FoodImage.find();
    res.render('app/food' , {foodImages})
})


router.post('/' , upload.array('image') , async (req , res)=>{
    console.log(req.body)
    const foodImages = new FoodImage({
        description: req.body.imageDescription, // Map the input name to the description field
        image: req.files.map(f => ({ url: f.path, filename: f.filename }))
    });
       await foodImages.save();
       req.flash('success' , 'Image Uploaded')
       res.redirect('/food')
    })
    

module.exports = router ;