var User = require('mongoose').model('User'),
    Room = require('mongoose').model('Room'),
    Game = require('mongoose').model('Game'),
    socket = require('../config/socket');
io = socket.getSocket();
var connections = {};
io.on('connection', function (socket) {
    socket.on('user', function(token) {
        socket.token = token;
        User.findOne({token: socket.token},function (err,data) {
            connections[data._id] = socket;
        })
        console.log('token',token);
    });
    socket.on('disconnect', function () {
       if(socket.token){
          User.findOne({token: socket.token},function (err,data) {
              console.log('User ' + data._id + ' vua out room ' + data.room)
              if(data){
                  data.status = 0;
                  data.save();
                  Room.findById(data.room,function(err,room){
                      console.log(room);
                      if(room){
                          if(room.people <=1){
                              console.log('co 1 dua thoi');
                              room.remove();
                          } else {
                              var indMember = room.members.indexOf(data._id);
                              if(room.status == 0){
                                  if(indMember >= 0){
                                      room.members.splice(indMember,1);
                                  }
                                  room.players[data._id] = null;
                                  room.ready = [];
                              } else if(room.status == 1){
                                  var tmp = room.players;
                                  room.players = {};
                                  if (tmp[data._id]) tmp[data._id].connect = 0;
                                  room.players = tmp;
                              }
                              room.people--;
                              room.save();
                              io.to(room._id).emit('leave',data._id);
                              socket.leave(room._id);
                          }
                      }
                  });
              }
          })
       }
    });
});
function mergeObject(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};
exports.findRoom = function(req,res){
    //$where:"this.members.length < " + req.game.min
    Room.findOne({ people: {$lt: req.game.min}, status: 0, game: req.game._id})
        .populate('members','username avatar displayName')
        .exec(function (err,room) {
        if(err){
            console.log(err);
            return res.status(400).send();
        }
        if(room){
            if(room.members.indexOf(req.user._id)<0){
                room.members.push(req.user._id);
            };
            var obj =  {};
            obj[req.user._id] = {score: 0, connect: 1};
            var tmp = mergeObject(room.players,obj);
            room.players = {};
            room.players = tmp;
            room.people++;
            room.save(function(err,result){
                if(result){
                    console.log('room moi ne', result);
                    var user = {
                        _id: req.user._id,
                        username: req.user.username,
                        displayName: req.user.displayName,
                        avatar: req.user.avatar
                    };
                    result.members[result.members.length - 1] = user;
                    req.user.status = 2;
                    req.user.room = room._id;
                    req.user.save();
                    if(connections[req.user._id]) connections[req.user._id].join(result._id);
                    io.to(result._id).emit('join',user);
                    return res.json({data: result});
                } else {
                    return res.status(400).send();
                }
            });
        } else {
            return res.json();
        }

    })
};
exports.createRoom = function (req,res) {
    var room = new Room(req.body);
    room.game = req.game._id;
    room.members = [req.user._id];
    room.host = req.user._id;
    room.players = {};
    room.players[req.user._id] = {score: 0, connect: 1};
    room.save(function(err,data){
        if(err) {
            return res.status(400).send();
        }
        if(connections[req.user._id]) connections[req.user._id].join(data._id);
        req.user.status = 2;
        req.user.room = data._id;
        req.user.save();
        return res.json({data: data});
    })
};
exports.updateRoom = function (req,res){
    if(req.body.ready){
        if(req.room.ready.indexOf(req.user._id)<0){
            req.room.ready.push(req.user._id);
            req.room.save();
            res.json();
            console.log('ready room',req.room._id);
            io.to(req.room._id).emit('ready',req.room.ready);
            return;
        }
    } else if (req.body.status){
        req.room.status = 1;
        req.room.save();
        return res.json();
    } else if (req.body.obj) {
        console.log(req.body.obj);
        if(req.room.players[req.user._id]) {
            var isEnd = false;
            var stt = {};
            var tmp = req.room.players;
            req.room.players = {};
            if(req.body.obj.isDead != null && req.body.obj.isWin == null) {
                var amount = 0;
                var length = 0;
                var maxScore = 0;
                Object.keys(tmp).forEach(function(e){
                    if(tmp[e].isDead == true || tmp[e].connect == 0) {
                        console.log('tang amount');
                        amount++;
                    }
                    if(maxScore < tmp[e].score) {
                        maxScore = tmp[e].score;
                        console.log('max',maxScore);
                    }
                    length++;
                });
                console.log('So luong nguoi da choi xong',amount);
                if(amount >= length - 1){
                    isEnd = true;
                    Object.keys(tmp).forEach(function(e){
                        if(tmp[e].score == maxScore){
                            tmp[e] = mergeObject(tmp[e],{isWin: true});
                            stt[e] = true;
                        } else {
                            tmp[e] = mergeObject(tmp[e],{isWin: false});
                            stt[e] = false;
                        }
                    });
                    console.log('temp',tmp);
                }
            }
            tmp[req.user._id] = mergeObject(tmp[req.user._id],req.body.obj);
            req.room.players = tmp;
            console.log('update',req.room.players);
            req.room.save();
            res.json();
            io.to(req.room._id).emit('players',req.room.players);
            if(isEnd) {
                io.to(req.room._id).emit('end',stt);
            };
            return;
        } else {
            res.status(400).send();
        }

    } else {
        res.status(400).send();
    }
};
exports.joinRoom = function(req,res){

};
exports.gameByID = function(req, res, next) {
    var gameId = null;
    if(req.body.gameId) {
        gameId = req.body.gameId
    } else if (req.query.gameId){
        gameId = req.query.gameId
    } else {
        return res.status(400).send();
    }
    Game.findById(gameId)
        .exec(function(err, game){
            if (err) {
                return res.status(400).send();
            }
            if (!game) {
                return res.status(400).send();
            }
            req.game = game;
            next();
        });
};
exports.roomByID = function(req, res, next, id) {
    Room.findById(id)
        .exec(function(err, room){
            if (err) {
                return res.status(400).send();
            }
            if (!room) {
                return res.status(400).send();
            }
            req.room = room;
            next();
        });
};