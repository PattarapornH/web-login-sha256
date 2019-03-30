const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');

// bring in user model
let User = require('../models/user');

// register form
router.get('/register', function (req, res) {
    res.render('register');
});

// register proccess
router.post('/register', function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password)
    
    User.findOne({ username: username }, function (err, document) {
        if(!document){
            let errors = req.validationErrors();

            if (errors) {
                res.render('register', {
                    errors: errors
                });
            } else {
                let newUser = new User({
                    username: username,
                    password: password
                });

                var salt = crypto.randomBytes(32).toString('hex');
                newUser.salt = salt;
                console.log("salt", salt)

                var hash_password = crypto.createHash('sha256').update(password).digest('hex');
                newUser.password = hash_password
                console.log("hash", hash_password)
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/');
                    }
                });
            }
        } else {
            console.log("nothing")
            res.redirect('/users/register')
            // if username exist do nothing
        }
    });


});

router.get('/home',function (req,res) {
    res.render('home');
})

// login process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/users/home',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

// logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/');
});

module.exports = router;