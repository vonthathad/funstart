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

angular.module('funstart').service('BattleService', function ($rootScope,$timeout,Rooms,$mdDialog) {
    var self = this;
    self.status = {};
    self.friends = {};
    self.opponent = {};
    self.currentPlayers = 0;
    self.isHost = true;
    self.init = function(game,user,roomId,start,error){
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
            self.isHost = false;
            self.joinRoom(roomId,start,function(message){
                console.log(message);
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.querySelector('.spinner-bg')))
                    .clickOutsideToClose(true)
                    .title('THÔNG BÁO!')

                    .ok('Okie!')
                if(message == 'FULL'){
                    alert.textContent('Rất tiếc, phòng đã đầy')
                    $mdDialog.show(alert).then(function() {
                        self.game = null;
                        self.status = {};
                        if(error) error();
                    }, function() {

                    });
                } else if(message == 'NULL'){
                    alert.textContent('Phòng không tồn tại');
                    $mdDialog.show(alert).then(function() {
                        self.game = null;
                        self.status = {};
                        if(error) error();
                    }, function() {
                    });
                } else {
                    alert.textContent('Có lỗi. Vui lòng thử lại sau');
                    $mdDialog.show(alert).then(function() {
                        self.game = null;
                        self.status = {};
                        if(error) error();
                    }, function() {
                    });
                }
                self.onCloseBattle();
            });

            console.log("In dialog");


        }
    }
    self.onCloseBattle = function(){
        //ket thuc man dau
        self.status = {};
        if(self.room) {
            self.room.$remove();
            self.room = null;
        }

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
    self.checkRoomReady = function(start){
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
                self.onBattle(start);
            }
        }
    };
    self.updateReady = function(start){
        Rooms.update({_id: self.room._id, ready: true});
        self.room.ready.push(self.user._id);
        if(self.room.mode=="find"){
            socket.on('ready',function(data){
                console.log('ready',data);
                self.room.ready = data;
                // var tmp = [];
                // console.log(self.room.members);
                // self.room.members.forEach(function(player){
                //     data.forEach(function(e){
                //         if(player._id == e){
                //             player.isReady = true;
                //             return true;
                //         }
                //     });
                //     tmp.push(player);
                // })
                // console.log(tmp);
                // self.room.members = tmp;
                self.checkRoomReady(start);
                $rootScope.$apply();
            });
        }
    };
    self.onFindBattle = function(success,error){
        self.status.isSearching = true;
        Rooms.get({gameId: self.game._id},function(res){
            console.log(res.data);
            if(res.data == null){
                self.createRoom("find");
            } else {
                self.room = new Rooms(res.data);
                self.checkRoomFull(false);
                self.listenRoom();
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
    self.joinRoom = function(roomId,start,error){
        Rooms.get({roomId: roomId},function(res){
            console.log(res.data);
            self.room = new Rooms(res.data);
            self.status.isWaitRoom = true;
            self.handlingRoom(start);
        },function(err){
            if(error) error(err.data.message);
        })

    };
    self.createRoom = function(mode,start,callback){
        Rooms.save({gameId: self.game._id, mode: mode},function (res) {
            self.room = new Rooms(res.data);
            self.room.members = [{
                _id: self.user._id,
                username: self.user.username,
                displayName: self.user.displayName,
                avatar: self.user.avatar
            }];
            if(self.room.mode=="room"){
                self.handlingRoom(start);
            } else{
                self.listenRoom();

            }
            if(callback) callback(res.data._id);
        },function(err){

        });
    };
    self.listenRoom = function () {
        console.log('te ra vo ca day');
        socket.on('join',function(data){
            self.room.members.push(data);
            self.checkRoomFull(true);
        });
        socket.on('leave',function(id){
            console.log('thang' + id + 'vua roi khoi');
            if(self.room && self.room.status == 0){
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
                $rootScope.$apply();
            }
        });
    };
    self.handlingRoom = function(start){
        socket.on('join',function(data){
            self.room.members.push(data);
        });
        socket.on('leave',function(id){
            if(self.room){
            console.log('thang' + id + 'vua roi khoi');
            self.room.members.forEach(function(e,i){
                if(e._id == id) self.room.members.splice(i,1);
                return true;
            })
            }
        });
        socket.on('ready',function(data){
            console.log('ready',data);
            self.room.ready = data;
            var tmp = [];
            console.log(self.room.members);
            self.room.members.forEach(function(player){
                data.forEach(function(e){
                    if(player._id == e){
                        player.isReady = true;
                        return true;
                    }
                });
                tmp.push(player);
            })
            console.log(tmp);
            self.room.members = tmp;
            self.checkRoomReady(start);
            $rootScope.$apply();
        });
    }
    self.onReady = function(start){
        //tat san sang
        if(self.room.mode = "find"){
            self.status.isFullRoom = false;
            self.status.isReady = true;
        }
        self.isReady = true;
        self.updateReady(start);
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
    self.orderPlayer = function(item){
        if(self.game.type==0){
            return -item.score;
        } else if(self.game.type==1){
            return item.turn;
        } else {
            return item.displayName;
        }
    }
    self.onCreateRoom = function(callback,start){
        self.isHost = true;
        if(self.room){
            self.room.$remove();
            self.room = null;
        }
        self.status.isWaitRoom = true;
        self.createRoom("room",start,function(key){
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
            });
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