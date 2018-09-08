const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname,'public')));

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

//get a single article
app.get('/article/:id',function(req,res){
    Article.findById(req.params.id, function(err, article){
        console.log(article);
        return;
    });
});

// Add Route
app.get('/articles/add', function(req,res){
    res.render('add_article',{
        title : 'Add Article'
    });
});

//add submit POST route
app.post('/articles/add',function(req,res) {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;
    article.save(function(err){
        if(err){
            console.log(err);
            return ;
        } else {
            res.redirect('/');
        }
    });

});

//start server
app.listen(3000,function(){
    console.log('Server started on port 3000...')
});