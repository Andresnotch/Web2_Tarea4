const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/login', (_, res) => {
    res.render('login');
});

router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        res.redirect('/');
    }
);

module.exports = router;