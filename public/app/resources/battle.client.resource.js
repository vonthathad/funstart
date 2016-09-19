
angular.module('funstart').service('BattleService', function ($rootScope,$timeout,$firebaseObject,$mdDialog) {
    var self = this;
    var gameClass = function(game){
        console.log(game);
        _game = this;
        _game.properties = {};
        _game._id = (game._id)?game._id:null;
        _game.properties.max = (game.max)?game.max:null;
        _game.properties.type = (game.type)?game.type:0;
        _game.ref = "games/" + this._id;
        _game.roomClass = function(roomId){
            _room = this;
            _room._id = (roomId)?roomId:null;
            _room.ref = null;
            _room.mode = null;
            _room.people = 0;
            _room.status = 0;
            _room.setID = function(id){
                _room._id = id;
                _room.ref = _game.ref + '/' + id;
            };
            _room.getUserRef = function(id){
                return _room.ref + '/players/USER' + id;
            }
            // _room.playerClass = function(ref){
            //     this = $firebaseObject(ref);
            //     // _player = this;
            //     // _player._id = user._id;
            //     // _player.ref = _room.ref + '/' + 'USER' + user._id;
            //     // _player.username = user.username;
            //     // _player.avatar = user.avatar;
            //     // _player.displayName = user.displayName;
            //     // _player.score = 0;
            //     // _player.turn = null;
            //     // _player.connect = 0;
            //     // _player.token = null;
            //     // _player.update = function(obj){
            //     //     self.db.ref(_player.ref).update(obj);
            //     // };
            // };
        }

    };
    var userClass = function(user){
        _user = this;
        _user._id = user._id;
        _user.avatar = user.avatar;
        _user.displayName = user.displayName;
        _user.username = user.username;
        _user.ref = 'users/' + user._id;
        _user.roomRef = null;
        _user.setRoomRef = function(ref){
            _user.roomRef = ref + '/players/USER' + _user._id;
        };
        _user.update = function (obj) {
            self.db.ref(_user.ref).update(obj);
        }
    };
    self.objDisconnect = {};
    self.status = {};
    self.friends = {};
    self.opponent = {};
    self.currentPlayers = 0;
    self.isHost = true;
    self.init = function(game,user,roomId,success,error){
        self.objDisconnect = {};
        self.currentPlayers = 0;
        self.isHost = true;
        self.db = firebase.database();
        console.log(game);
        self.game = new gameClass(game);
        self.user = new userClass(user);
        self.game.room = new self.game.roomClass(roomId);
        self.game.room.players = [];
        self.game.room.members = [];
        console.log(self.game);
        console.log(self.user);
        self.game.room.mode = 'find';
        self.opponent = {
            username: null,
            avatar: null,
            displayName: null,
            amount: 0
        };
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
        self.db.ref(self.game.room.ref).child("people").child("value").off("value");
        self.db.ref(self.game.room.ref).off("value");
        self.status = {};
        self.db.ref().update(self.objDisconnect);
        self.game = null;

    }
    self.updateReady = function (number,callback) {
        $rootScope.$apply(function(){
            self.currentPlayers = number;
        });
        if(number == self.game.room.people) {
            self.onBattle(callback);
        }
    }
    self.handlingRoom = function () {
        self.db.ref(self.game.room.ref).child("people").child("value").on('value', function(data) {
            console.log('nghe thay doi nguoi',data.val());
            if(self.game){
                if(data.val() < self.game.room.people && (self.status.isFullRoom || self.status.isReady)){
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
                };
                self.setDisconnectObj(data.val());
                // function(){
                self.checkRoomFull(self.game.room.people);
                // });
            }

        })
    };
    self.checkRoomFull = function(number){
        console.log("people",number);
        if(number == self.game.properties.max){
            console.log("full roi");
            self.status.isSearching = false;
            //game san sang
            if(self.game.room.status==0){
                self.status.isFullRoom = true;
            }
            $rootScope.$apply();

        }
    }
    self.addPlayers = function(){
        self.db.ref(self.game.room.ref).child("players").once("value",function(snap) {
            self.game.room.players = [];
            Object.keys(snap.val()).forEach(function (user) {
                var id = user.split("USER")[1];
                var player = $firebaseObject(self.db.ref(self.game.room.getUserRef(id)));
                self.game.room.players.push(player);
                if (self.opponent.username == null && id != self.user._id){
                    self.opponent = player;
                }
            });
        });
    }
    self.onFindBattle = function(success,error){
        self.game.room._id = null;
        //bat dau search
        self.status.isSearching = true;
        self.db.ref('games/'+ self.game._id).orderByChild("people/value").endAt(self.game.properties.max-1).once("value",function(snap){
            console.log(snap.val());
            Object.keys(snap.val()).forEach(function(e){
                console.log(e);
                if(e.indexOf("ROOM")>=0 && snap.val()[e].mode!='room' && snap.val()[e].status == 0){
                    self.game.room.setID(e);
                    self.user.setRoomRef(self.game.room.ref);
                    self.joinRoom(function(){
                        self.checkRoomFull(snap.val()[e].people.value + 1);
                        self.handlingRoom();
                        if(success) success();
                    },function(){
                        if(error) error();
                    })
                    return true;
                }
            });
            if(!self.game.room._id){
                self.createRoom();
            }
        });
    };
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
        var ref = self.db.ref();
        key = 'ROOM' + ref.push().key;
        var objRoom = {
            "people" : {"value": 1},
            "status": 0,
            "host": {"value":self.user._id},
            "ready" : {"value": 0},
            "mode": self.game.room.mode,
            "players": {}
        };
        objRoom.players['USER' + self.user._id] = {"connect": 1, "score": 0, "avatar": self.user.avatar,"username": self.user.username,"displayName": self.user.displayName};
        var userObj = {
            "status" : {"value": 2},
            "room" : {"value": key},
            "game" : {"value": self.game._id}
        };
        self.game.room.setID(key);
        self.user.setRoomRef(self.game.room.ref);
        self.db.ref(self.game.room.ref).set(objRoom);
        self.db.ref(self.user.ref).update(userObj);

        if(self.game.room.mode=="room"){
            self.listenRoom();
        } else{
            self.handlingRoom();
        }
        if(callback) callback(key);
    };
    self.listenRoom = function (callback) {
        self.db.ref(self.game.room.ref).once('value', function(data) {
            if(data.val()){
                self.game.room.members = [];
                Object.keys(data.val().players).forEach(function(e){
                    var id = e.split("USER")[1];
                    var player = $firebaseObject(self.db.ref(self.game.room.getUserRef(id)));
                    self.game.room.members.push(player);
                    if (self.opponent.username == null && id != self.user._id) {
                        self.opponent = player;
                    }

                });
                self.game.room.people = data.val().people.value;
                self.db.ref(self.game.room.ref).child("people").child("value").on('value', function(data) {
                    if(self.game){
                        if(self.status.isWaitRoom){
                            self.db.ref(self.game.room.ref).once("value",function(snap){
                                Object.keys(snap.val().players).forEach(function(e){
                                    if(data.val() < self.game.room.people && e.split("USER")[1] == self.user._id) {
                                        console.log("Co vao doi host");
                                        self.isHost = true;
                                        $rootScope.$apply();
                                        self.db.ref(self.game.room.ref).child("host").update({"value" : self.user._id});
                                        return true;
                                    }
                                });
                                self.game.room.members = [];
                                Object.keys(snap.val().players).forEach(function(e){
                                    var id = e.split("USER")[1];
                                    var player = $firebaseObject(self.db.ref(self.game.room.getUserRef(id)));
                                    self.game.room.members.push(player);
                                    if (self.opponent.username == null && id != self.user._id) {
                                        self.opponent = player;
                                    }
                                });
                                self.setDisconnectObj(data.val());
                            })

                        } else {
                            self.setDisconnectObj(data.val());
                        }

                    }

                })
            }
        });


    }
    self.setDisconnectObj = function(number){
        self.game.room.people = number;
        self.db.ref().onDisconnect().cancel();
        self.objDisconnect = {};
        if(self.game.room.people <= 1){
            //|| self.isHost && self.game.room.mode == "room"
            self.objDisconnect[self.game.room.ref] = {delete: null};
        } else {
            self.objDisconnect[self.game.room.ref + '/people'] = {"value": self.game.room.people - 1};
            if (self.game.room.status == 0) {
                if(self.isHost){
                    self.objDisconnect[self.game.room.ref + '/host' ] = {"value": null};
                }
                self.objDisconnect[self.user.roomRef] = {delete: null};
            } else {
                self.objDisconnect[self.user.roomRef + '/connect'] = 0;
                self.objDisconnect[self.user.roomRef + '/isWin'] = false;
            }
            // self.objDisconnect[self.game.room.ref] = {delete: null};
        }
        console.log('disconnect',self.objDisconnect);
        self.db.ref().onDisconnect().update(self.objDisconnect);
    }
    self.onReady = function(callback){
        //tat san sang
        if(self.game.room.mode = "find"){
            self.status.isFullRoom = false;
            self.status.isReady = true;
            self.addPlayers();
        };
        console.log(self.game.room.players);
        // self.game.room.players = $firebaseArray(self.db.ref(self.game.room.ref).orderByKey().startAt("USER"));
        self.db.ref(self.user.roomRef).child("isReady").once("value",function (snap){
            console.log("user nhan ready",snap.val())
            if(!snap.val()){
                console.log('vo trong cai nay');
                self.db.ref(self.game.room.ref).child("ready/value").transaction(function(value) {
                    return value + 1;
                },function(error, committed, snapshot){
                    if(error){
                        if(self.game.room.mode = "find") {
                            self.status.isFullRoom = true;
                            self.status.isReady = false;
                        }
                        mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.querySelector('.spinner-bg')))
                                .clickOutsideToClose(true)
                                .title('THÔNG BÁO!')
                                .textContent('Vui lòng thử lại')
                                .ok('Okie!')
                        );
                    } else {
                        self.currentPlayers = snapshot.val();
                        self.db.ref(self.user.roomRef).update({"isReady": true});
                        self.updateReady(snapshot.val(),callback);
                        self.db.ref(self.game.room.ref).child("ready").on("child_changed",function(data){
                            self.currentPlayers = data.val();
                            self.updateReady(data.val(),callback);
                        })
                    }

                });
            }
        })

    };
    self.onBattle = function(callback){
        if(self.game.room.mode == "room"){
            self.game.room.players = self.game.room.members;
        }
        self.status.isWaitRoom = false;
        //tat san sang
        self.status.isReady = false;
        //bat bat dau choi
        self.status.isIntro = true;
        self.db.ref(self.user.ref).update({
            "status": {
                "value" : 2
            }
        });
        self.game.room.status = 1;
        self.handlingRoom();
        self.handleResultDialog();
        self.db.ref(self.game.room.ref).update({"status": 1});
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
        if(self.game.properties.type==0){
            return -item.score;
        } else if(self.game.properties.type==1){
            return item.turn;
        } else {
            return item.displayName;
        }
    }
    self.onCreateRoom = function(callback){
        self.isHost = true;
        self.status.isWaitRoom = true;
        self.game.room.mode = 'room';
        self.createRoom(function(key){
            self.game.room.link = window.location.href.split("?")[0] + '?roomId=' + key;
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
        self.db.ref(self.user.roomRef).update(obj,function(err){
            if(!err && callback) callback();
        });

    };
    self.handleResultDialog = function(){
        self.db.ref(self.user.roomRef).child("isWin").on("value",function(snap){
            if(snap.val()!=null){
                if(snap.val()==true){
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
            }

        })

    }
    self.checkWin = function(bool){
        self.status.isEndGame = true;
        if(bool!=null){
            self.game.room.players.forEach(function (e) {
                if(e.$id.split("USER")[1] == self.user._id){
                    e.isWin = bool;
                    e.$save();
                };
            });


        } else {
            var highScore = 0;
            var deads = 0;
            self.game.room.players.forEach(function (e) {
                if(highScore < e.score){
                    highScore = e.score;
                };
                if(e.isDead){
                    console.log('here');
                    deads++;
                }
            });
            console.log(deads);
            console.log(highScore);
            if(self.game.room.people == deads){
                console.log('chui vo day ne');
                self.game.room.players.forEach(function (e) {
                    console.log(e);
                    if(e.score == highScore){
                        e.isWin = true;

                    } else {
                        e.isWin = false;

                    }
                    e.$save();
                });
            }
        }
    }
});