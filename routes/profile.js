const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/', (req, res) => {
    if (!req.user) {
        res.redirect('/auth/login')
    }
    console.log("Render User");
    const profile = {name: req.user.name,
    timestamp: req.user.timestamp,
    email: req.user.email,
    photo: req.user.photo};
    console.log(profile);
    res.render('profile', {profile});
})

module.exports = router;