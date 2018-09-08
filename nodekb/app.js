const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', function(){
    console.log('Connected to MongoDB');
});

//check for db error
db.on('error',function(err){
    console.log(err);
});

//init app
const app = express();

//bring in models
let Article = require('./models/article');

//load view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');


//home route
app.get('/', function(req,res){
    Article.find({},function(err,articles) {
        if(err){
            console.log(err);
        } else {
            res.render('index',{
                title: 'Articles',
                articles : articles
            });
        }
    });
});

// Add Route
app.get('/articles/add', function(req,res){
    res.render('add_article',{
        title : 'Add Article'
    });
});

//start server
app.listen(3000,function(){
    console.log('Server started on port 3000...')
});