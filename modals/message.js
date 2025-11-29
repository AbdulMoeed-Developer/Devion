const { required } = require('joi');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    msg: {
        type : String,
        required : true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Refers to the 'User' model
        required: true
    }
})

const Message = mongoose.model('Message' , messageSchema)
module.exports = Message;