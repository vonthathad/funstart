var User = require('mongoose').model('User'),
    Room = require('mongoose').model('Room'),
    Game = require('mongoose').model('Game');

exports.findRoom = function(req,res){
    
};
exports.createRoom = function (req,res) {
    
};
exports.updateObj = function (req,res){
    
};

exports.roomByID = function(req, res, next, id) {
    Room.findById(id)
        .exec(function(err, room){
            if (err) {
                return res.status(400).send();
            }
            if (!game) {
                return res.status(400).send();
            }
            req.room = room;
            next();
        });
};