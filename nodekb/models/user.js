const mongoose = require('mongoose');

//use schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);
