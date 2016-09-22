//var io = require('socket.io')(8080);
//connections = {};
//io.sockets.on('connection', function(socket) {
//    socket.on('username', function(username) {
//        connections[username] = socket;
//
//        console.log('here2' + username);
//    });
//});
//module.exports = {
//    connections : connections,
//    io : io
//}
// var io = require('socket.io')(8888);
// console.log('io',io);
// exports.getSocket = function(){
//     return io;
// };

var app = require('http').createServer();
var io = require('socket.io')(app);
app.listen(8080);
exports.getSocket = function(){
    return io;
};