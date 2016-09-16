var passport = require('passport');
var users =  require('../controllers/user.server.controller.js');
var games =  require('../controllers/game.server.controller.js');
var Game = require('mongoose').model('Game');
module.exports = function(app) {
  app.get('/oauth/facebook', passport.authenticate('facebook', {scope: ['user_friends','email','public_profile']}));
  app.get('/oauth/facebook/callback',  passport.authenticate('facebook',users.authFacebookFail,users.authFacebookSuccess));
  app.post('/auth/signin',users.authSignin);
  app.get('/auth/action',users.renderAction);
  app.post('/auth/signup',users.authSignup);
  app.get('/game/:gameId',games.renderGame);
  app.get('/test/:key/:game',games.renderTest);
  app.param('gameId', games.gameByID);
  app.get('*', function (req, res, next) {
    if(req.url.indexOf('sources')<0 && req.url.indexOf('api')<0 && req.url.indexOf('uploaded')<0){
      console.log(req.url);
      var app = {
        id: '170584416691811',
        name: 'Fun Start',
        description: 'Phá đảo thế giới ảo!',
        url: 'http://www.funstart.net',
        image: 'http://www.funstart.net/sources/ads.jpg'
      };
      res.render('index', {app: app});
    } else {
      next();
    }

  });
}
