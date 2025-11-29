const express = require('express');
const router = express.Router();
const {SportImage} = require('../modals/image')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage });

router.get('/', async (req,res)=>{
    const sportImages = await SportImage.find()
    res.render('app/sport' , {sportImages})
})



router.post('/' , upload.array('image') , async (req , res)=>{
    console.log(req.body)
    const sportImages = new SportImage({
        description: req.body.imageDescription, // Map the input name to the description field
        image: req.files.map(f => ({ url: f.path, filename: f.filename }))
    });
       console.log(sportImages)
       await sportImages.save();
       req.flash('success' , 'Image Uploaded')
       res.redirect('/sport')
    })
    


module.exports = router ;