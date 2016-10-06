var express = require('express');
var ioApp = express();
var socket = require('socket.io');
var LEX = require('letsencrypt-express');
var https = require('http2');
var lex = LEX.create({
    configDir: '/etc/letsencrypt'
    , letsencrypt: null
    , approveRegistration: function (hostname, cb) {
        cb(null, {
            domains: ['www.funstart.net']
            ,email: 'secret.andoan@gmail.com'
            ,agreeTos: true
        });
    }
});

var server = https.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, ioApp));
server.listen(443);

var io = socket.listen(server);

// var io = require('socket.io')(8088);
// console.log('io',io);
exports.getSocket = function(){
    return io;
};