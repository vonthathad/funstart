var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    Jwt = require('jsonwebtoken'),
    config = require('../config'),
    User = require('mongoose').model('User');
privateKey = config.key.privateKey;
function locdau(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, "");
    str = str.replace(/ /g, "");
    return str;
}
var saveOAuthUserProfile = function (req, profile, done) {
    User.findOne({
        provider: profile.provider,
        providerId: profile.providerId
    }, function (err, user) {
        if (err) {
            console.log(err);
            return done(err);
        } else {
            if (!user) {
                console.log('herrr');
                var possibleUsername = profile.username;
                User.findUniqueUsername(possibleUsername, null,
                    function (availableUsername) {
                        profile.username = availableUsername;
                        profile.trackData = {};
                        user = new User(profile);
                        user.save(function (err, user) {
                            console.log(err);
                            if (err) {
                                return req.res.redirect('/signup');
                            }
                            return done(err, user.toObject({ virtuals: true }));
                        });
                    });
            } else {
                return done(err, user);
            }
        }
    });
};
module.exports = function () {
    passport.use(new TwitterStrategy({
        // clientID: config.facebook.clientID,
        // clientSecret: config.facebook.clientSecret,
        // callbackURL: config.facebook.callbackURL,
        // profileFields: config.facebook.profileFields,
        // passReqToCallback: true
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: config.twitter.callbackURL,
        passReqToCallback: true
    },
        function (req, accessToken, refreshToken, profile, done) {
                 console.log("TWITTER " + JSON.stringify(profile));
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;
            var username = (profile.emails) ? profile.emails[0].value.split("@")[0] : locdau(profile.displayName);
            username = username.substring(0, 14);
            var email = profile.emails ? profile.emails[0].value : (username + "@funstart.net");
            var tokenData = {
                email: email
            };
            var avatar = providerData.profile_image_url_https;
            console.log("AVATER  " + JSON.stringify(avatar));
            var token = Jwt.sign(tokenData, privateKey);
            var providerUserProfile = {
                email: email,
                username: username,
                displayName: username,
                token: token,
                avatar: avatar,
                isVerified: true,
                provider: 'twitter',
                providerId: profile.id,
                providerData: providerData
            };
            console.log("TWITTER PROFILE " + JSON.stringify(providerUserProfile));
            if (profile.displayName) {
                providerUserProfile.displayName = profile.displayName;
            }
            saveOAuthUserProfile(req, providerUserProfile, done);
        }));
};
