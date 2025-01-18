const mongoose = require('mongoose');
// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    uid: {
        type: String,
        required: true,
        unique: true
    },
    picture :{
        type: String,
        required: true
    },
    tasks: [{
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }]
    // password: {
    //     type: String,
    //     required: true
    // }
},
    { timestamps: true }
);


module.exports = mongoose.model('User', userSchema);