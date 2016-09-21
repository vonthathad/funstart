angular.module('funstart').factory('Rooms', ['$resource',
    function($resource) {
        return $resource('api/battle/:roomId', {
            roomId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
// angular.module('funstart').factory('Players', ['$resource',
//     function($resource) {
//         return $resource('api/battle/:gameId/:roomId', {
//             gameId: '@gameId',
//
//         }, {
//             update: {
//                 method: 'PUT'
//             }
//         });
//     }
// ]);
angular.module('funstart').factory('Disconnect', ['$resource',
    function($resource) {
        return $resource('api/disconnect', {
            gameId: '@game',
            roomId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);
angular.module('funstart').service('BattleService', function ($rootScope,$timeout,Rooms,Disconnect,$mdDialog) {
    var self = this;
    self.status = {};
    self.friends = {};
    self.opponent = {};
    self.currentPlayers = 0;
    self.isHost = true;
    self.init = function(game,user,roomId,success,error){
        self.currentPlayers = 0;
        self.isHost = true;
        console.log(game);
        self.game = game;
        self.room = null;
        self.user = user;
        self.players = [];
        self.members = [];
        self.opponent = {};
        self.status = {
            isSearching: false,
            isFullRoom: false,
            isReady: false,
            isIntro: false,
            isFullscreen: false,
            isEndGame: false,
            isWaitRoom: false
        }
        if(roomId) {
            console.log('here');
            self.game.room.mode = 'room';
            self.game.room.setID(roomId);
            self.db.ref(self.game.room.ref).child("people").child("value").once("value",function(snap){
                if(snap.val()){
                    self.isHost = false;
                    self.status.isWaitRoom = true;
                    self.user.setRoomRef(self.game.room.ref);
                    self.joinRoom(function(){
                        self.listenRoom();
                    },function(){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('.spinner-bg')))
                                .clickOutsideToClose(true)
                                .title('THÔNG BÁO!')
                                .textContent('Rất tiếc, phòng đã đầy')
                                .ok('Okie!')
                        );
                        self.onCloseBattle();
                    })
                } else {
                    console.log("In dialog");
                    var alert = $mdDialog.alert()
                        .parent(angular.element(document.querySelector('.spinner-bg')))
                        .clickOutsideToClose(true)
                        .title('THÔNG BÁO!')
                        .textContent('Phòng không tồn tại')
                        .ok('Okie!')
                    $mdDialog.show(alert).then(function() {
                        self.game = null;
                        self.status = {};
                        if(error) error();
                    }, function() {

                    });
                    $mdDialog.show(

                    );
                }

            });

        }
    }
    self.onCloseBattle = function(){
        //ket thuc man dau
        self.status = {};
        Rooms.remove({_id: self.room._id});
    }
    self.checkRoomFull = function(bool){
        console.log('min', self.game.min);
        if(self.room.members.length >= self.game.min){
            console.log("full roi");
            self.status.isSearching = false;
            if(self.room.status==0) {
                self.status.isFullRoom = true;
            }
            if(bool) $rootScope.$apply();
        }
    }
    self.checkRoomReady = function(callback){
        if(self.room.ready.length >= self.room.members.length){
            console.log("ready roi");
            self.status.isReady = false;
            if(self.room.status==0) {
                self.room.members.forEach(function(e){
                    if(e._id != self.user._id){
                        self.opponent = e;
                        return true;
                    }
                });
                self.players = self.room.members;
                self.status.isIntro = true;
                self.onBattle(callback);
                $rootScope.$apply();
            }

        }
    };
    self.updateReady = function(callback){
        Rooms.update({_id: self.room._id, ready: true});
        self.room.ready.push(self.user._id);
        socket.on('ready',function(data){
            console.log('ready',data);
            self.room.ready = data;
            self.checkRoomReady(callback);
        });

    };
    self.onFindBattle = function(success,error){
        self.status.isSearching = true;
        Rooms.get({gameId: self.game._id},function(res){
            console.log(res.data);
            if(res.data == null){
                self.createRoom();
            } else {
                self.room = new Rooms(res.data);
                self.checkRoomFull(false);
                socket.on('join',function(data){
                    self.room.members = data;
                    self.checkRoomFull(true);
                })
                socket.on('leave',function(data){
                    if(self.game.status == 0){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('.spinner-bg')))
                                .clickOutsideToClose(true)
                                .title('THÔNG BÁO!')
                                .textContent('Có đối thủ vừa thoát, hệ thống đang tìm kiếm lại!')
                                .ok('Okie!')
                        );
                        self.status.isFullRoom = false;
                        self.status.isReady = false;
                        self.status.isSearching = true;
                        self.checkRoomFull(true);
                    }
                });
            };
        },function(err){
            //xu ly loi
        })
    };
    self.updatePlayers = function(){
        var tmp = [];
        Object.keys(self.room.players).forEach(function(e){

            console.log(self.room.players);
            self.players.forEach(function(player){
                if(player._id == e){
                    player.score = self.room.players[e].score;
                    player.isDead = self.room.players[e].isDead;
                    player.isWin = self.room.players[e].isWin;
                    tmp.push(player);
                    return true;
                }
            })
        });
        self.room.players = tmp;
    }
    self.joinRoom = function(success,error){
        self.db.ref(self.game.room.ref).child("people/value").transaction(function(value) {
            return value + 1;
        },function(err, committed, snapshot){
            if(err){
                if (error) error();
            } else {
                var userObj = {
                    "status" : {"value": 2}
                };
                self.db.ref(self.user.ref).update(userObj);
                self.db.ref(self.user.roomRef).update({"connect": 1, "score": 0, "avatar": self.user.avatar,"username": self.user.username,"displayName": self.user.displayName});
                if(success) success();
            }
        });

    };
    self.createRoom = function(callback){
        Rooms.save({gameId: self.game._id},function (res) {
            self.room = new Rooms(res.data);
            self.room.members = [{
                _id: self.user._id,
                username: self.user.username,
                displayName: self.user.displayName,
                avatar: self.user.avatar
            }];
            if(self.room.mode=="room"){

            } else{
                self.listenRoom();
                // self.handlingRoom();
            }
            if(callback) callback(res.data._id);
        },function(err){

        });
    };
    self.listenRoom = function (callback) {
        socket.on('join',function(data){
            self.room.members.push(data);
            self.checkRoomFull(true);
        });
    }
    self.onReady = function(callback){
        //tat san sang
        if(self.room.mode = "find"){
            self.status.isFullRoom = false;
            self.status.isReady = true;
            self.updateReady(callback);
        };
    };
    self.onBattle = function(callback){

        self.status.isWaitRoom = false;
        //tat san sang
        self.status.isReady = false;
        //bat bat dau choi
        self.status.isIntro = true;
        self.room.status = 1;
        Rooms.update({_id: self.room._id,status: true});
        socket.on('players',function (players) {
            self.room.players = players;
            self.updatePlayers();
            $rootScope.$apply();
        });
        socket.on('leave',function(id){
            console.log('thang' + id + 'vua roi khoi');
            self.players.forEach(function(e){
                if(e._id == id) e.connect = 0;
            })
        });
        self.handleResultDialog();
        $timeout(function () {
            //mo man choi
            //mo class battle
            self.status.isFullscreen = true;
            if(callback) callback();
            //bat dau game
        },6000)
    };
    // self.onBattleRoom = function (){
    //     self.objDisconnect[self.user.roomRef + '/connect'] = 0;
    //     self.db.ref(self.user.ref).update({
    //         "status": {
    //             "value" : 2
    //         }
    //     });
    //     self.objDisconnect[self.user.roomRef + '/connect'] = 0;
    //     self.status.isWaitRoom = false;
    //     //mo man choi
    //     $scope.isPlay = true;
    //     //mo class battle
    //     self.status.isFullscreen = true;
    //     //bat dau game
    //     $scope.start();
    // }
    self.orderPlayer = function(item){
        if(self.game.type==0){
            return -item.score;
        } else if(self.game.type==1){
            return item.turn;
        } else {
            return item.displayName;
        }
    }
    self.onCreateRoom = function(callback){
        self.isHost = true;
        self.status.isWaitRoom = true;
        self.room.mode = 'room';
        self.createRoom(function(key){
            self.room.link = window.location.href.split("?")[0] + '?roomId=' + key;
        });
        if(callback) callback();
        // var toastBattleAgain = $mdToast.simple()
        //     .textContent('Lời mời đã được gửi đi')
        //     .position('center center');
        // $mdToast.show(toastBattleAgain).then(function(response) {
        //     //callback
        // });
        // 1. Gui list user vua choi ve 1 API
        // 2. Tren server nhan list user va them vao database muc invite
        // 3. Khi co nguoi thay doi status la 1, gui thong bao ve tat ca cac nguoi choi thong qua child change
        // 4. Chi host moi co quyen thay doi status game sang 1. Khi do server se lang nghe va xoa het tat ca nguoi choi co status 0
    }
    self.onListInvite = function(){
        self.friends.data = [];
        //list friend
        angular.forEach(FriendsService.data,function(friend){
            self.friends.data.push(friend);
        })
    }
    self.updateObj = function(obj,callback){
        Rooms.update({_id: self.room._id, obj: obj});
    };
    self.handleResultDialog = function(){
        socket.on("end",function(stt){
            var win = null;
            console.log('end',stt);
            Object.keys(stt).forEach(function(e){
                if(e == self.user._id){
                   win = stt[e];
                }
            })

            if(win){
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('.recommend-games')))
                        .clickOutsideToClose(true)
                        .title('CHÚC MỪNG!')
                        .textContent('Bạn đã chiến thắng!')
                        .ok('Okie!')
                );
            } else {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('.recommend-games')))
                        .clickOutsideToClose(true)
                        .title('CHIA BUỒN!')
                        .textContent('Bạn thua cmnr!')
                        .ok('Okie!')
                );
            }

        })
    };
    self.onDead = function(bool){
        self.status.isEndGame = true;
        if(bool!=null){
            Rooms.update({_id: self.room._id, obj: {isWin: bool, isDead: true}});
        } else {
            Rooms.update({_id: self.room._id, obj: {isDead: true}});
        }
    }
});