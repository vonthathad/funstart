
var games = require('../controllers/game.server.controller.js');
var activities = require('../controllers/activity.server.controller.js');
var users = require('../controllers/user.server.controller.js');
var uploads = require('../controllers/upload.server.controller.js');
var passport = require('passport');
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
module.exports = function (router) {
    router.use(passport.authenticate('bearer', { session: false }));
    router.get('/topics', games.loadTopics);
    //////////////////////////////////////////////////
    ////GET USER DATA, Header Authorization By Token
    //////////////////////////////////////////////////
    router.get('/token', users.authToken);

    router.route('/games')
        .get(games.loadGames)
        .post(games.createGame);
    router.route('/games/:gameId')
        .get(games.loadGame)
        .put(games.updateGame)
        .delete(games.deleteGame);

    // router.post('/uploadresult/:game', uploads.uploadResult);
    router.post('/shooting/:gameId', uploads.captureResult);
    router.param('gameId', games.gameByID);
    router.route('/activities')
        .get(activities.loadActivities)
        .post(activities.createActivity);
    router.route('/users')
        .get(users.loadUsers);
    router.route('/users/:username')
        .get(users.loadUser)
        .put(users.followUser);
    router.route('/user')
        .put(users.updateUser);
    router.param('username', users.userByUsername);

};  
