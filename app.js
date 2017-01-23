//set NODE_ENV
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.DOMAIN = process.env.DOMAIN || 'topgame.co';
process.env.PORT = process.env.PORT || '8235';
process.env.PROTOCOL = process.env.PROTOCOL || 'http';
process.env.CHANNEL = process.env.CHANNEL || 'en';

var mongoose = require('./app/config/mongoose');
var db = mongoose(function () {
    var express = require('./app/config/express')();
    var passport = require('./app/config/passport')();
});
//module.exports = app;
