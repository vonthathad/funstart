var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('mongoose').model('User');
module.exports = function() {
    passport.use(new LocalStrategy(function(email, password, done) {
        User.findOne({
            email: email
        }, function(err, user) {
            console.log(user);
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false, {
                    message: 'Tài khoản không tồn tại'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Sai mật khẩu'
                });
            }
            return done(null, user);
        });
    }));
};