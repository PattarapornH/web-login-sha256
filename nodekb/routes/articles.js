const express = require('express');
const router = express.Router();

// article model
let Article = require('../models/article');

// user model
let User = require('../models/user');

// add route
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_article', {
        title: 'Add Country'
    });
});

// add submit POST route
router.post('/add', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('body', 'Body is required').notEmpty();

    // get errors
    let errors = req.validationErrors();

    if (errors) {
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        // article.body = req.body.body;
        article.gold = req.body.gold;
        article.silver = req.body.silver;
        article.bronze = req.body.bronze

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Article Added');
                res.redirect('/');
            }
        });
    }
});

// load edit form
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_article', {
            title: 'Update Medals of ' + article.title,
            article: article
        });
    });
});

// update submit POST route
router.post('/edit/:id', function (req, res) {
    let article = {};
    // article.title = req.body.title;
    // article.author = req.body.author;
    // article.body = req.body.body;
    // article.title = req.title;
    // article.author = article.body.author;
    article.gold = req.body.gold;
    article.silver = req.body.silver;
    article.bronze = req.body.bronze;

    let query = { _id: req.params.id }

    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            req.flash('success', 'Article Updated');
            res.redirect('/');
        }
    });
});

// del article
router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = { _id: req.params.id }

    Article.findById(req.params.id, function (err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            });
        }
    });
});

// get single article
router.get('/:id', function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        User.findById(article.author, function (err, user) {
            res.render('article', {
                article: article,
                author: user.name
            });
        });
    });
});

// access control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}

module.exports = router;