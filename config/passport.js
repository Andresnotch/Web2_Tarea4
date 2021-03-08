const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
let users = require('../data/users.json');

passport.use(
    new GoogleStrategy({
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/google/callback',
        },
        function (accessToken, refreshToken, profile, done) {
            console.log('Authing');
            done(null, profile);
        }
    )
);


passport.serializeUser(function (user, done) {
    console.log("Serialize");
    done(null, user);
});

passport.deserializeUser(function (id, done) {
    console.log("Deserialize");
    const user = users.find(element => element.id = id);
    if (user) {
        done(null, user);
    }
    else done(null, null);
});