const express = require('express');
const router = express.Router();
const {ArtImage} = require('../modals/image')
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage });


router.get('/', async (req,res)=>{
    const artImages = await ArtImage.find();
    res.render('app/art' , {artImages})
})




router.post('/' , upload.array('image') , async (req , res)=>{
    console.log(req.body)
    const artImages = new ArtImage({
        description: req.body.imageDescription, // Map the input name to the description field
        image: req.files.map(f => ({ url: f.path, filename: f.filename }))
    });
       console.log(artImages)
       await artImages.save();
       req.flash('success' , 'Image Uploaded')
       res.redirect('/arts')
    })
    

module.exports = router ;

