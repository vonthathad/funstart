var io = require('socket.io')(8080);
console.log('io',io);
exports.getSocket = function(){
    return io;
};