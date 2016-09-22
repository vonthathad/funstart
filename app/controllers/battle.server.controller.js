var User = require('mongoose').model('User'),
    Room = require('mongoose').model('Room'),
    Game = require('mongoose').model('Game');
//     socket = require('../config/socket');
// io = socket.getSocket();
// var connections = {};
// Require HTTP module (to start server) and Socket.IO
var http = require('http'), io = require('socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){

    // Send HTML headers and message
    res.writeHead(200,{ 'Content-Type': 'text/html' });
    res.end('<h1>Hello Socket Lover!</h1>');
});
server.listen(8080);
var io = io.listen(server);
io.on('connection', function (socket) {
    socket.on('user', function(token) {
        socket.token = token;
        User.findOne({token: socket.token},function (err,data) {
            if(data) connections[data._id] = socket;
        })
        console.log('token',token);
    });
    socket.on('disconnect', function () {
       if(socket.token){
          User.findOne({token: socket.token},function (err,data) {
              console.log('User ' + data._id + ' vua out room ' + data.room)
              if(data){
                  disconnect(data);
              }
          })
       }
    });
});
function disconnect(data){
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
                        room.people--;
                        var tmp = room.players;
                        room.players = {};
                        delete tmp[data._id];
                        room.players = tmp;
                        room.ready = [];
                    }
                    // var tmp = room.players;
                    // room.players = {};
                    // Object.keys(tmp).forEach(function(e){
                    //     delete tmp[e].isReady;
                    // });
                    // room.players = tmp;
                } else if(room.status == 1){
                    var tmp = room.players;
                    room.players = {};
                    if (tmp[data._id]) {
                        tmp[data._id].connect = 0;
                        room.people--;
                    }
                    room.players = tmp;
                }
                room.save();
                io.to(room._id).emit('leave',data._id);
                connections[data._id].leave(room._id);
            }
        }
    });
    data.status = 0;
    data.room = null;
    data.save();
}
function mergeObject(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
};
exports.outRoom = function(req,res){
    disconnect(req.user);
    res.json();
};
exports.findRoom = function(req,res){
    //$where:"this.members.length < " + req.game.min
    Room.findOne({ people: {$lt: req.game.min}, status: 0, game: req.game._id,mode: "find"})
        .populate('members','username avatar displayName')
        .exec(function (err,room) {
        if(err){
            console.log(err);
            return res.status(400).send();
        }
        if(room){
            enterRoom(room,req.user,function(result){
                return res.json({data: result});
            },function(){
                return res.status(400).send();
            })
        } else {
            return res.json();
        }

    })
};
function enterRoom(room,user,success,error) {
    if(room.members.indexOf(user._id)<0){
        room.members.push(user._id);
    };
    var obj =  {};
    obj[user._id] = {score: 0, connect: 1};
    var tmp = mergeObject(room.players,obj);
    room.players = {};
    room.players = tmp;
    room.people++;
    room.save(function(err,result){
        if(result){
            console.log('room moi ne', result);
            var player = {
                _id: user._id,
                username: user.username,
                displayName: user.displayName,
                avatar: user.avatar
            };
            result.members[result.members.length - 1] = player;
            user.status = 2;
            user.room = room._id;
            user.save();
            if(connections[user._id]) connections[user._id].join(result._id);
            io.to(result._id).emit('join',player);
            if(success) success(result);
        } else {
            if(error) error();
        }
    });
}
exports.createRoom = function (req,res) {
    var room = new Room();
    room.game = req.game._id;
    room.mode = req.body.mode || "find";
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
            // var tmp = req.room.players;
            // req.room.players = {};
            // if(tmp[req.user._id]){
            //     tmp[req.user._id] = mergeObject(tmp[req.user._id],{isReady: true});
            // }
            // req.room.players = tmp;
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
            if(req.body.obj.isDead != null) {
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
                    if(req.body.obj.isWin == null){
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
    if(req.room.people >= req.room.game.max){
        return res.status(400).send({message: 'FULL'});
    } else {
        enterRoom(req.room,req.user,function(result){
            return res.json({data: result});
        },function(){
            return res.status(400).send();
        });
    }
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
        .populate('members','username avatar displayName')
        .populate('game','min max')
        .exec(function(err, room){
            if (err) {
                return res.status(400).send();
            }
            if (!room) {
                return res.status(400).send({message: 'NULL'});
            }
            req.room = room;
            next();
        });
};