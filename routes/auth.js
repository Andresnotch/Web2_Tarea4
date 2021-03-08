const express = require('express');
const passport = require('passport');
let users = require('../data/users.json');
const fs = require('fs');
const router = express.Router();


router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/login', async function (_, res) {
    res.render('login');
});

router.get('/google/login', async function (req, res) {
    res.send("Texto login");
});

router.get('/google/redirect', async function (req, res) {
    console.log(req.query.code);
    res.redirect('/');
});


router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        const profile = req.user
        const currentUser = users.find(element => element.id = profile.id);

        if (currentUser) {
            res.set('user', currentUser)
            res.redirect('/profile');
        } else {
            let new_user = {
                id: users.length + 1,
                id: profile.id,
                name: profile.displayName,
                timestamp: new Date(),
                email: profile.emails[0].value,
                photo: profile.photos[0].value
            };
            users.push(new_user);
            fs.writeFile('./data/users.json', JSON.stringify(users), function (err, data) {
                if (err) {
                    return console.log(err);
                }
            });
            res.set('user', new_user)
            res.redirect('/profile');

        }
    }
);

router.get('/logout', async function (req, res) {
    req.session = null;
    req.user = null;
    res.redirect('/');
});


module.exports = router;