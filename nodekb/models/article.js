let mongoose = require('mongoose');

// article schema
let articleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    // body: {
    //     type: String,
    //     required: true
    // }
    gold: {
        type: Number,
        required: true
    },
    silver: {
        type: Number,
        required: true
    },
    bronze: {
        type: Number,
        required: true
    }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
