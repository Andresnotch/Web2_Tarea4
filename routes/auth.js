const express = require('express');
const passport = require('passport');
const router = express.Router();


router.get('/login', (_, res) => {
    res.render('login');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/login', (req, res) => {
    res.send("Texto login");
});

router.get('/google/redirect', (req, res) => {
    res.send("Texto redirect");
});

router.get('/logout', (req, res) => {
    res.send("Texto logout")
})

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        console.log("Request");
        console.log(req);
        res.redirect('/');
    }
);

module.exports = router;