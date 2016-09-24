var User = require('mongoose').model('User'),
    Room = require('mongoose').model('Room'),
    Game = require('mongoose').model('Game');
    socket = require('../config/socket');
io = socket.getSocket();
var connections = {};
var roomsInterval = {};
io.on('connection', function (socket) {
    socket.on('user', function(token) {
        socket.token = token;
        User.findOne({token: socket.token},function (err,data) {
            if(data) connections[data._id] = socket;
            data.status = 1;
            data.save();

        })
        console.log('token',token);
    });
    socket.on('disconnect', function () {
       if(socket.token){
          User.findOne({token: socket.token},function (err,data) {

              if(data){
                  console.log('User ' + data._id + ' vua out room ' + data.room)
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
                var tmpTurn = null;
                var tmp = room.players;
                room.players = {};
                if(room.status == 0){
                    if(indMember >= 0){
                        room.members.splice(indMember,1);
                        room.people--;
                        tmpTurn = tmp[data._id].turn;
                        delete tmp[data._id];
                        room.ready = [];
                        room.players = tmp;
                    }
                    // var tmp = room.players;
                    // room.players = {};
                    // Object.keys(tmp).forEach(function(e){
                    //     delete tmp[e].isReady;
                    // });
                    // room.players = tmp;
                } else if(room.status == 1){
                    if (tmp[data._id]) {
                        tmp[data._id].connect = 0;
                        room.people--;
                        if(room.time){
                            console.log('vo update turn khi disconnect',tmp);
                            var dataTurn = {};
                            if(room.turn == data._id){
                                Object.keys(tmp).forEach(function(e){
                                    if(tmp[e].connect == 1){
                                        tmp[e].turn --;
                                        if(tmp[e].turn == 0){
                                            room.turn = e;
                                        };
                                        dataTurn[e] = tmp[e].turn;
                                    } else {
                                        tmp[e].turn = null;
                                        dataTurn[e] = null;
                                    }
                                });
                                console.log('vo trong nay',room.turn);
                                console.log('vo trong nay data',dataTurn);
                                io.to(room._id).emit('turn',dataTurn);
                            } else {
                                tmpTurn = tmp[data._id].turn;
                                Object.keys(tmp).forEach(function(e){
                                    if(tmp[e].connect == 1 && tmp[e].turn > tmpTurn){
                                        tmp[e].turn --;
                                        dataTurn[e] = tmp[e].turn;
                                    } else {
                                        tmp[e].turn = null;
                                        dataTurn[e] = null;
                                    }
                                });
                            }
                            room.players = tmp;
                            setRoomInterval(room);
                        } else {
                            room.players = tmp;
                        }
                    }

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
function setRoomInterval(room){
    if(roomsInterval[room._id]){
        clearInterval(roomsInterval[room._id]);
        roomsInterval[room._id] = null;
    }
    roomsInterval[room._id] = setInterval(function () {
        console.log('chui zo interval');
        var dataTurn = {};
        var amount = 0;
        var player0 = null;
        Room.findById(room._id,function(err,result){
            if(result){
                var tmp = result.players;
                result.players = {};
                Object.keys(tmp).forEach(function(e){
                    if(tmp[e].connect == 1){
                        if(tmp[e].turn > 0){
                            tmp[e].turn --;
                            if(tmp[e].turn == 0) result.turn = e;
                            dataTurn[e] = tmp[e].turn;
                        } else {
                            player0 = e;
                        }
                        amount++;
                    } else {
                        tmp[e].turn = null;
                        dataTurn[e] = null;
                    }
                });
                if(player0) {
                    tmp[player0].turn = amount - 1;
                    dataTurn[player0] = amount - 1;
                }
                io.to(result._id).emit('turn',dataTurn);
                result.players = tmp;
                result.save();
            } else {
                clearInterval(roomsInterval[room._id]);
            }

        });
    }, room.time*1000);
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
    console.log('thanh vien trong room', room.members);
    if(room.members.indexOf(user._id)<0){
        room.members.push(user._id);
        room.people++;
    };
    var obj =  {};
    obj[user._id] = {score: 0, connect: 1, turn: room.people - 1};
    var tmp = mergeObject(room.players,obj);
    room.players = {};
    room.players = tmp;
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
            io.to(result._id).emit('join',result.members);
            if(success) success(result);
        } else {
            if(error) error();
        }
    });
}
exports.createRoom = function (req,res) {
    var room = new Room();
    room.game = req.game._id;
    console.log('time',req.game.time);
    if(req.game.time) {
        room.time = req.game.time;
    }
    room.mode = req.body.mode || "find";
    room.members = [req.user._id];
    room.turn = req.user._id;
    room.players = {};
    room.players[req.user._id] = {score: 0, connect: 1, turn: 0};
    console.log(room);
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
        if(req.room.status == 0) {
            req.room.status = 1;
            if(req.room.time) setRoomInterval(req.room);
        };
        req.room.save();
        return res.json();
    } else if (req.body.obj) {
        if((!req.room.time || req.room.time && req.room.turn == req.user._id) && req.room.players[req.user._id]){
            var isEnd = false;
            var stt = {};
            var tmp = req.room.players;
            req.room.players = {};
            if(req.room.time){
                var amount = 0;
                var dataTurn = {};
                var player0 = null;
                console.log('set lai interval');
                Object.keys(tmp).forEach(function(e){
                    if(tmp[e].connect == 1){
                        if(tmp[e].turn > 0){
                            tmp[e].turn --;
                            if(tmp[e].turn == 0) req.room.turn = e;
                            dataTurn[e] = tmp[e].turn;
                        } else {
                            player0 = e;
                        }
                        amount++;
                    } else {
                        tmp[e].turn = null;
                        dataTurn[e] = null;
                    }
                });

                if(player0) {
                    tmp[player0].turn = amount - 1;
                    dataTurn[player0] = amount - 1;
                }
                io.to(req.room._id).emit('turn',dataTurn);
                setRoomInterval(req.room);
            }
            if(req.body.obj.isDead != null){
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
    } else if (req.room.status == 1){
        return res.status(400).send({message: 'PLAYED'});
    } else {
        enterRoom(req.room,req.user,function(result){
            return res.json({data: result});
        },function(){
            return res.status(400).send();
        });
    }
};
exports.inviteToRoom = function(req,res){
    var data = {
        game: req.room.game._id,
        room: req.room._id,
        user: {
            _id: req.user._id,
            username: req.user.username
        }
    };
    if(req.body.players){
        req.body.players.data.forEach(function (player) {
            console.log(player, 'moi');
            if(connections[player]) connections[player].emit('invite',data);
        });
    } else if(req.body.player){
        if(connections[req.body.player]) connections[req.body.player].emit('invite',data);
    };
    res.json();
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
        .populate('game','title min max')
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