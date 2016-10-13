var io = require('socket.io')(8088);
// console.log('io',io);
exports.getSocket = function(){
    return io;
};