const express = require('express');
const router = express.Router();
const {TravelImage} = require('../modals/image');
const multer  = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({ storage });

router.get('/', async (req,res)=>{
    const travelImages = await TravelImage.find() 
    res.render('app/travel' , {travelImages})
})
router.post('/' , upload.array('image') , async (req , res)=>{
console.log(req.body)
const travelImages = new TravelImage({
    description: req.body.imageDescription, // Map the input name to the description field
    image: req.files.map(f => ({ url: f.path, filename: f.filename }))
});
   await travelImages.save();
   req.flash('success' , 'Image Uploaded')
   res.redirect('/travel')
})


module.exports = router ;