const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
// const todoSchema = new mongoose.Schema({
//     todo : {
//         type : String,
//         required : true
//     },
//     priority:{
//         type : String,
//         enum: ['Low' , 'Medium' , 'High']
//     },
//     description:{
//         type : String
//     },
//     date:{
//         type: Date,
//         required : true
//     }
// })

// const Todo = mongoose.model('Todo', todoSchema);
// module.exports = Todo;

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required: true
    }
    
})

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User' , userSchema)
module.exports = User