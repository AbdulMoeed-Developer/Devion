const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    // HERE COMES THE SCHEMA
    description: String,
    image: [
        {
            url : String,
            filename:String
        }
    ]
})

const ArtImage = mongoose.model('ArtImage', imageSchema);
const SportImage = mongoose.model('SportImage', imageSchema);
const TravelImage = mongoose.model('TravelImage', imageSchema);
const FoodImage = mongoose.model('FoodImage', imageSchema);

module.exports = {
    ArtImage,
    SportImage,
    TravelImage,
    FoodImage
};