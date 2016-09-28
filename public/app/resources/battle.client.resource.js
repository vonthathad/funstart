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
angular.module('funstart').factory('Invite', ['$resource',
    function($resource) {
        return $resource('api/invite/:roomId', {
            roomId: '@roomId'
        });
    }
]);
angular.module('funstart').service('FriendsOnlineService',['Users',function(Users){
    var self = {
        'isLoading': false,
        'hasMore': true,
        'data' : [],
        'order' : 'exp',
        'page' : 1,
        'userId': null,
        'init' :  function(){
            self.isLoading = false;
            self.hasMore = true;
            self.page = 1;
            self.data = [];
            self.order = 'exp';
        },
        'loadMore' : function () {
            self.loadFriends();
        },
        'loadFriends': function (callback) {
            if (self.hasMore && !self.isLoading) {
                self.isLoading = true;
                var params = {
                    friend: self.userId,
                    page: self.page,
                    order: self.order,
                    online: true
                };
                Users.get(params,function (res) {
                    angular.forEach(res.data,function(user){
                        self.data.push(new Users(user));

                    });
                    console.log(self.data);
                    self.isLoading = false;
                    console.log(self.data);
                    if(!res.isNext){
                        self.hasMore = false;
                    }
                    self.page++;
                    if(callback) callback();
                });
            }
        }
    };
    return self;

}]);
angular.module('funstart').service('BattleService', function ($rootScope,$timeout,Rooms,Invite,$mdDialog,FriendsOnlineService) {
    var self = this;
    self.status = {};
    self.friends = {};
    self.opponent = {};
    self.friends = {};
    self.isHost = true;
    self.init = function(game,user,roomId,error){
        self.isHost = true;
        self.isReady = false;
        self.game = game;
        self.room = null;
        self.user = user;
        self.players = [];
        self.opponent = {};
        self.status = {
            isSearching: false,
            isFullRoom: false,
            isReady: false,
            isIntro: false,
            isFullscreen: false,
            isEndGame: false,
            isWaitRoom: false
        };
        if(roomId) {
            self.isHost = false;
            self.joinRoom(roomId,function(message){
                var alert = $mdDialog.alert()
                    .parent(angular.element(document.querySelector('.spinner-bg')))
                    .clickOutsideToClose(true)
                    .title('THÔNG BÁO!')
                    .ok('Okie!');
                if(message == 'FULL'){
                    alert.textContent('Rất tiếc, phòng đã đầy')
                } else if(message == 'NULL'){
                    alert.textContent('Phòng không tồn tại');
                } else if(message == 'PLAYED'){
                    alert.textContent('Phòng đã bắt đầu');
                } else {
                    alert.textContent('Có lỗi. Vui lòng thử lại sau');
                }
                $mdDialog.show(alert).then(function() {
                    self.status = {};
                    if(error) error();
                }, function() {
                });
                self.onCloseBattle();
            });
        }
    }
    self.onCloseBattle = function(){
        //ket thuc man dau
        self.status = {};
        if(self.room) {
            self.room.$remove(function(res){
                self.room = null;
            },function (err) {
                
            });
        }
    };
    self.checkRoomFull = function(bool){
        if(self.room.members.length >= self.game.min){
            self.status.isSearching = false;
            if(self.room.status==0) {
                self.status.isFullRoom = true;
            }
            if(bool) $rootScope.$apply();
        }
    }
    self.checkRoomReady = function(start){
        if(self.room && self.room.ready.length >= self.room.members.length){
            self.status.isReady = false;
            if(self.room.status==0) {
                self.room.members.forEach(function(e){
                    if(e._id != self.user._id){
                        self.opponent = e;
                        return true;
                    }
                });
                self.players = self.room.members;
                self.onBattle(start);
            }
        }
    };
    self.updateReady = function(start){
        Rooms.update({_id: self.room._id, ready: true});
        self.room.ready.push(self.user._id);
        socket.off('ready');
        socket.on('ready',function(data){
            self.room.ready = data;
            var tmp = [];
            self.room.members.forEach(function(player){
                data.forEach(function(e){
                    if(player._id == e){
                        player.isReady = true;
                        return true;
                    }
                });
                tmp.push(player);
            })
            self.room.members = tmp;
            self.checkRoomReady(start);
            $rootScope.$apply();
        });
    };
    self.onFindBattle = function(success,error){
        socket.off('ready');
        socket.off('join');
        socket.off('leave');
        socket.off('win');
        self.status.isSearching = true;
        Rooms.get({gameId: self.game._id},function(res){
            if(res.data == null){
                self.createRoom("find");
            } else {
                self.isHost = false;
                self.room = new Rooms(res.data);
                self.checkRoomFull(false);
                self.listenRoom();
            };
        },function(err){
            //xu ly loi
        })
    };
    self.updatePlayers = function(){
        // var tmp = [];
        Object.keys(self.room.players).forEach(function(e){
            self.players.forEach(function(player){
                if(player._id == e){
                    player.score = self.room.players[e].score;
                    player.isDead = self.room.players[e].isDead;
                    player.isWin = self.room.players[e].isWin;
                    player.turn = self.room.players[e].turn;
                    // tmp.push(player);
                    return true;
                }
            })
        });
        // self.room.players = tmp;
    }
    self.joinRoom = function(roomId,error){
        socket.off('ready');
        socket.off('join');
        socket.off('leave');
        Rooms.get({roomId: roomId},function(res){
            self.room = new Rooms(res.data);
            self.status.isWaitRoom = true;
            self.handlingRoom();
        },function(err){
            if(error) error(err.data.message);
        })

    };
    self.createRoom = function(mode,callback){

        Rooms.save({gameId: self.game._id, mode: mode},function (res) {
            self.room = new Rooms(res.data);
            self.room.members = [{
                _id: self.user._id,
                username: self.user.username,
                displayName: self.user.displayName,
                avatar: self.user.avatar
            }];
            if(self.room.mode=="room"){
                self.handlingRoom();
            } else{
                self.listenRoom();

            }
            if(callback) callback(res.data._id);
        },function(err){

        });
    };
    self.listenRoom = function () {
        socket.on('join',function(data){
            if(self.room) {
                self.room.members = data;
                if(self.room.mode = "find") self.checkRoomFull(true);

            }
        });
        socket.on('leave',function(id){
            if(self.room && self.room.mode == "find" && self.room.status == 0){
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
    self.handlingRoom = function(){
        socket.on('join',function(data){
            self.room.members = data;
            $rootScope.$apply();
        });
        socket.on('leave',function(id){
            if(self.room){
            self.isReady = false;
            console.log('here');
            self.room.members.forEach(function(e,i){
                if(e._id == id) self.room.members.splice(i,1);
                return true;
            })
            $rootScope.$apply();
            }
        });
        socket.on('ready',function(data){
            console.log('ready chua click');
            self.room.ready = data;
            var tmp = [];
            self.room.members.forEach(function(player){
                data.forEach(function(e){
                    if(player._id == e){
                        player.isReady = true;
                        return true;
                    }
                });
                tmp.push(player);
            })
            self.room.members = tmp;
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
            self.players.forEach(function(e){
                if(e._id == id) e.connect = 0;
                $rootScope.$apply();
            })
        });
        self.handleResultDialog();
        setTimeout(function () {
            //mo man choi
            //mo class battle
            self.status.isFullscreen = true;
            $rootScope.$apply(function () {
                if(callback) callback();
            });
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
    };
    self.invite = function (user) {
        if(self.room) Invite.save({roomId: self.room._id,player: user._id},function(res){
        },function (err) {
        });
    }
    self.onCreateRoom = function(){
        socket.off('ready');
        socket.off('join');
        socket.off('leave');
        self.isHost = true;
        self.friends = FriendsOnlineService;
        self.friends.userId = self.user._id;
        self.friends.loadFriends();
        console.log(self.friends);
        if(self.room){
            var players = [];
            self.players.forEach(function(player){
                if(player._id != self.user._id) players.push(player._id);
            });
            self.room.$remove(function(){
                self.isHost = true;
                self.isReady = false;
                self.room = null;
                self.opponent = {};
                self.status = {
                    isSearching: false,
                    isFullRoom: false,
                    isReady: false,
                    isIntro: false,
                    isFullscreen: false,
                    isEndGame: false,
                    isWaitRoom: true
                };
                self.createRoom("room",function(key){
                    if(players) Invite.save({roomId: key,players: {data: players}},function(res){
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('.battle-room')))
                                .clickOutsideToClose(true)
                                .title('THÔNG BÁO!')
                                .textContent('Lời mời đã được gửi đi')
                                .ok('Okie!')
                        );
                    },function (err) {

                    });
                    self.isReady = false;
                    self.room.link = window.location.href.split("?")[0] + '?roomId=' + key;
                });
            });
        } else {
            self.status.isWaitRoom = true;
            self.createRoom("room",function(key){
                self.isReady = false;
                self.room.link = window.location.href.split("?")[0] + '?roomId=' + key;
            });
        }
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
        self.friends = FriendsOnlineService;
        self.friends.userId = self.user._id;
        self.friends.loadFriends();
    };
    self.updateObj = function(obj,callback){
        if(self.room) Rooms.update({_id: self.room._id, obj: obj});
    };
    self.handleResultDialog = function(){
        socket.on("end",function(stt){
            var win = null;
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