/**
 * Created by PHI LONG on 9/6/2016.
 */
angular.module('funstart').controller('BattleController', [
    '$http', '$rootScope', '$scope', '$interval', '$mdToast', '$mdDialog', '$timeout'
    , function ($http, $rootScope, $scope, $interval, $mdToast, $mdDialog, $timeout) {

        var db         = firebase.database();
        var update     = {};
        var vm         = this;
        vm.gameProcess = 'beforeGame';
        var x          = $rootScope.user;
        // alert($rootScope.user);
        vm.thisPlayer  = {
            id: $rootScope.user.id,
            name: $rootScope.user.displayName,
            avatar: $rootScope.user.avatar
        };
        vm.roomGame    = {};


        var medone           = false,
            otherdone        = false;
        var cQuestion        = 0;
        var noupdate         = {};
        const IS_ONLINE_FREE = 1,
            // IS_ONLINE_BUSY   = 2,
            IS_OFFLINE       = 3;
        const INVITE_TO      = 'INVITE_TO',
            REFUSE_INVITE_TO = 'REFUSE_INVITE_TO',
            AGREE_INVITE_TO  = 'AGREE_INVITE_TO';
        vm.activated         = true;
        vm.receiveMessage    = null;
        var questions        = [
            {
                //     t: 2,
                //     q: "Đâu là hình vuông?",
                //     i: "http://science-all.com/images/circle/circle-06.jpg",
                //     as: {
                //         0: "http://www.tho.com.vn/sites/www.tho.com.vn/files/resource/18742/photo/682_tam-giac.png",
                //         1: "http://www.kidsmathgamesonline.com/images/pictures/shapes/rectangle.jpg",
                //         2: "http://science-all.com/images/circle/circle-06.jpg",
                //         3:"http://i0.kym-cdn.com/photos/images/newsfeed/000/096/044/trollface.jpg?1296494117"
                //     },
                //     a: 0
                // }, {
                t: 1,
                q: "Which one of the five is least like the other four?",
                as: {
                    0: "Dog",
                    1: "Mouse",
                    2: "Snake",
                    3: "Elephant"
                },
                a: 2
                // }, {
                //     t: 1,
                //     q: "Mary, who is sixteen years old, is four times as old as her brother. How old will Mary be when she is twice as old as her brother?",
                //     as: {
                //         0: "20",
                //         1: "24",
                //         2: "25",
                //         3: "28"
                //     },
                //     a: 1
                // }, {
                //     t: 1,
                //     q: "Which one of the five choices makes the best comparison? Finger is to Hand as Leaf is to:",
                //     as: {
                //         0: "Twig",
                //         1: "Tree",
                //         2: "Branch",
                //         3: "Blossom"
                //     },
                //     a: 0
                // }, {
                //     t: 1,
                //     q: "If you rearrange the letters CIFAIPC you would have the name of a(n):",
                //     as: {
                //         0: "City",
                //         1: "Animal",
                //         2: "Ocean",
                //         3: "Country"
                //     },
                //     a: 2
                // }, {
                //     t: 1,
                //     q: "Choose the number that is 1/4 of 1/2 of 1/5 of 200:",
                //     as: {
                //         0: "2",
                //         1: "5",
                //         2: "10",
                //         3: "25"
                //     },
                //     a: 1
            }
        ];

        $scope.take_info = function () {

        };
        db.ref('users').orderByChild('status').equalTo(1).on('child_changed', function (snapshot) {
            console.log(snapshot.val());
            // snapshot.forEach(function (data) {
            //     alert(data.key);
            // });
        });
        $scope.battle_playGame = function (gameId) {
            // nếu chưa có phòng
            if (vm.roomGame.key == null) {
                $http.get('http://localhost:8000/api/findroom/' + gameId).then(function (res) {
                    vm.roomGame.gameId = gameId;
                    vm.roomGame.key    = res.data.data;
                    // alert('Đã tạo roomGame với key: ' + vm.roomGame.key);
                    $scope.shutdown    = true;
                    // theo dõi phòng bị đóng hay chưa
                    db.ref('games/' + gameId + '/' + vm.roomGame.key).on("child_removed", function (snapshot) {
                        // đóng phòng game
                        if ($scope.shutdown) {
                            alert("Đã đóng game room " + vm.roomGame.key);
                            vm.roomGame.key       = null;
                            vm.roomGame.members = {};
                        }
                        $scope.shutdown = false;
                    });

                    // lấy id của những người trong phòng, gán điểm bằng 0, đủ max người cho bắt đầu game
                    vm.roomGame.members                   = {};
                    vm.roomGame.members[vm.thisPlayer.id] = {score: 0, stage: 0};
                    // bắt đầu game những người trước người cuối cùng
                    db.ref('games/' + gameId + '/' + vm.roomGame.key).on('child_added', function (snapshot) {
                        if (snapshot.key !== vm.thisPlayer.id && snapshot.key !== 'people' && snapshot.key !== 'turn') {
                            if (vm.roomGame.members[snapshot.key] === undefined) {
                                vm.roomGame.members[snapshot.key] = {score: 0, stage: 0};
                            }
                            if (Object.keys(vm.roomGame.members).length == vm.roomGame.maximumPlayers) {
                                // bắt đầu game
                                // alert('Game bắt đầu: ' + JSON.stringify(vm.roomGame.members));
                                startPlay();
                            }
                        }
                    });


                    // disconnect thi xoa phong luon
                    update = {};
                    update['games/' + gameId + '/' + vm.roomGame.key]
                           = null;
                    update['users/' + vm.thisPlayer.id + '/status'] = 0;
                    db.ref().onDisconnect().update(update);

                });
            } else {
                alert('Bạn đang ở trong game room ' + vm.roomGame.key);
            }
        };


        $scope.battle_endGame = function (gameId) {
            if (vm.roomGame.key != null) {

                update = {};
                update['games/' + gameId + '/' + vm.roomGame.key]
                       = null;
                db.ref().update(update);

                vm.roomGame.key       = null;
                vm.roomGame.members = {};
            } else {
                alert('Hãy bắt đầu 1 game trước khi kết thúc');
            }
        };
        $scope.init           = function (playerid) {
            vm.roomGame.key            = null;
            vm.roomGame.maximumPlayers = 2;
            findOnlineUsers();

            getDisplayChallegersQueue(playerid);

            setStatus(IS_ONLINE_FREE, playerid);

            listenTo(INVITE_TO, playerid);
            listenTo(REFUSE_INVITE_TO, playerid);
            listenTo(AGREE_INVITE_TO, playerid);

        };


        vm.onlineUsers = [];
        function findOnlineUsers() {
            vm.onlineUsers = [];
            db.ref('USER').orderByChild('status').equalTo(IS_ONLINE_FREE).limitToFirst(3).once('value').then(function (snapshot) {
                snapshot.forEach(function (data) {
                    // alert(data);
                    if (data.key !== vm.thisPlayer.id) {
                        var user = {
                            id: data.key,
                            name: data.val().name
                        };
                        $scope.$apply(function () {
                            vm.onlineUsers.push(user);
                        });
                    }
                });
            });
        }

        function getDisplayChallegersQueue(playerid) {
            var challagers = [];
            db.ref('USER/' + playerid + '/challengersQueue').once('value').then(function (snapshot) {
                snapshot.forEach(function (data) {
                    var challager = {
                        senderId: data.val().senderId,
                        senderName: data.val().senderName,
                        questionId: data.val().questionId,
                        questionName: data.val().questionName,
                        time: new Date(data.val().time).toLocaleString()
                    };
                    challagers.push(challager);
                });
                // alert(JSON.stringify(challagers[0]));
                $scope.$apply(function () {
                    vm.challagers = challagers;
                    vm.activated  = false;
                });
            });

        }

        function listenTo(kindOfListener, key) {
            db.ref('LISTENER').child(kindOfListener).orderByKey().equalTo(key).on("child_added", function (snapshot) {
                processActions(kindOfListener, snapshot);
            });
            db.ref('LISTENER').child(kindOfListener).orderByKey().equalTo(key).on("child_changed", function (snapshot) {
                processActions(kindOfListener, snapshot);
            });
        }

        function displayButton(challager) {
            $scope.$apply(function () {
                vm.mesageSender = challager;
            });
        }

        function insertToChallengerQueue(challager, receiverId) {
            var update                                                 = {};
            // var key = db.ref('USER/' + receiverId + '/waitingopponent').push().key;
            var key                                                    = challager.senderId + ':' + challager.questionId;
            update['/USER/' + receiverId + '/challengersQueue/' + key] = challager;
            db.ref().update(update);
        }

        function removeFromChallegerQueue(senderId, receiverId, questionId) {
            var update                                               = {};
            // var key = db.ref('USER/' + receiverId + '/waitingopponent').push().key;
            var key                                                  = receiverId + ':' + questionId;
            update['/USER/' + senderId + '/challengersQueue/' + key] = null;
            db.ref().update(update);
        }

        function processActions(kindOfListener, snapshot) {

            var receiverId, challager, senderId, questionId;

            if (kindOfListener === INVITE_TO) {

                receiverId       = snapshot.key;
                challager        = {
                    senderId: snapshot.val().from,
                    senderName: snapshot.val().name,
                    questionId: snapshot.val().question,
                    questionName: snapshot.val().question,
                    time: new Date(snapshot.val().time).toLocaleString()
                };
                // funstart
                vm.countdownPlay = 10;
                vm.invitation    = 1;
                // end funstart
                displayButton(challager);
                insertToChallengerQueue(challager, receiverId);

                var k = true;
                vm.challagers.forEach(function (data, index) {

                    if (data.senderId == challager.senderId && data.questionId == challager.questionId) {
                        $scope.$apply(function () {
                            vm.challagers.splice(index, 1, challager);
                        });
                        k = false;
                    }

                });

                if (k) {
                    $scope.$apply(function () {
                        vm.challagers.push(challager);
                    });
                }

            } else if (kindOfListener === REFUSE_INVITE_TO) {

                receiverId = snapshot.key;
                senderId   = snapshot.val().from;
                questionId = snapshot.val().question;
                deleteListener(REFUSE_INVITE_TO, receiverId);
                removeDisplayChallegersQueue(senderId, questionId);
                removeFromChallegerQueue(senderId, receiverId, questionId);

            } else if (kindOfListener === AGREE_INVITE_TO) {

                receiverId     = snapshot.key;
                senderId       = snapshot.val().from;
                var senderName = snapshot.val().name;
                // questionId   = snapshot.val().question;
                deleteListener(AGREE_INVITE_TO, receiverId);
                play(senderId, senderName, receiverId + '+' + senderId);

            }
        }

        function changingNumber() {
            return (cQuestion + 0.1) * 0.001;
        }

        var stop;

        function countdown() {

            noupdate = {};
            noupdate['/LISTENER/ROOM/' + vm.roomKey + '/' + vm.thisPlayer.id + '/score']
                     = changingNumber();

            // vm.countdown        = 11;
            vm.determinateValue = 106;
            stop                = $interval(function () {
                // if (vm.determinateValue % 10 == 0) {
                //     vm.countdown--;
                // }
                if (vm.determinateValue < 100) {
                    vm.countdown = Math.floor(vm.determinateValue / 10) + 1;
                }
                vm.determinateValue -= 1;
                if (vm.countdown === 0) {
                    // vm.determinateValue = 100;
                    vm.countdown = -1;
                    if (noupdate['/LISTENER/ROOM/' + vm.roomKey + '/' + vm.thisPlayer.id + '/score'] < 1) {
                        db.ref().update(noupdate);
                    }
                    anwerQuestion(++cQuestion, 0);
                }
            }, 100);
        }

        function afterGivingAnswer_resetTheColor() {
            angular.element('#' + currentChoice).removeClass('wAnswer');
            angular.element('#' + currentChoice).removeClass('cAnswer');
            angular.element('#' + vm.question.a).removeClass('cAnswer');
        }

        function makeTheAnswerReappearAgain() {
            for (var i = 0; i < 4; i++) {
                angular.element('#' + i).addClass('fade-in');
                angular.element('#' + i).removeClass('QuizFightAnswers');
                angular.element('#' + i).removeClass('fade-out');
            }
        }

        function anwerQuestion(u, v) {
            // for(var i = 0; i < 4; i++){
            //     angular.element('#' + i).addClass('bounceIn');
            // }
            // countdown();
            $interval.cancel(stop);

            if (cQuestion === 0) {

                vm.question = questions[cQuestion];
                countdown();

            } else {

                angular.element('#' + vm.question.a).addClass('cAnswer');

                for (var i = 0; i < 4; i++) { // làm biến mất các đáp án sai

                    if (i != vm.question.a) {
                        angular.element('#' + i).addClass('fade-out');
                    }

                    angular.element('#' + i).removeClass('fade-in');

                }

                $timeout(function () { // đợi 2s cho các đáp án sai mờ đi

                    afterGivingAnswer_resetTheColor();

                    if (cQuestion < questions.length) { // vẫn còn câu hỏi thì hỏi tiếp
                        $scope.isDisabled = false;
                        vm.question       = questions[cQuestion];

                        makeTheAnswerReappearAgain();

                        $timeout(function () {
                            for (var i = 0; i < 4; i++) {
                                angular.element('#' + i).addClass('QuizFightAnswers');
                            }
                        }, 1000);

                        $timeout(function () {
                            countdown();
                        }, 2000);

                    } else { // hết câu hỏi thì end game

                        vm.gameProcess = 'afterGame';
                        noupdate       = {};
                        noupdate['/LISTENER/ROOM/' + vm.roomKey + '/' + vm.thisPlayer.id + '/status']
                                       = 'end';
                        db.ref().update(noupdate);
                        if (v === 1) {
                            $scope.$apply(function () {
                                if (vm.thisPlayer.currentScore > vm.opponent.currentScore) {
                                    vm.result      = 'winner';
                                    vm.otherResult = 'loser';
                                } else {
                                    vm.result      = 'loser';
                                    vm.otherResult = 'winner';
                                }
                            });
                        } else {
                            if (vm.thisPlayer.currentScore > vm.opponent.currentScore) {
                                vm.result      = 'winner';
                                vm.otherResult = 'loser';
                            } else {
                                vm.result      = 'loser';
                                vm.otherResult = 'winner';
                            }
                        }

                    }
                }, 2000);
            }
        }

        function play(opponentId, opponentName, roomKey) {
            vm.gameProcess             = 'inGame';
            vm.roomKey                 = roomKey;
            vm.thisPlayer.currentScore = 0;
            vm.opponent                = {
                id: opponentId,
                name: opponentName,
                currentScore: 0
            };

            noupdate = {};
            noupdate['/LISTENER/ROOM/' + vm.roomKey + '/' + vm.thisPlayer.id + '/status']
                     = 'start';
            db.ref().update(noupdate);

            listenToOpponentScore(roomKey, opponentId);
            listenToOpponentGameStatus(roomKey, opponentId);
            anwerQuestion();
        }

        function startPlay() {
            vm.roomGame.full = true;

            // //lắng nghe điểm của các đối thủ
            // db.ref('games').child(vm.roomGame.gameId + '/' + vm.roomGame.key + '/' + vm.thisPlayer.id + '/score').on("child_changed", function (dataChanged) {
            //     // vm.roomGame.members[dataChanged.key]['score'] = dataChanged.val();
            //     alert(dataChanged.key + " " + dataChanged.val())
            // }
            // );
            db.ref('games').child(vm.roomGame.gameId + '/' + vm.roomGame.key).orderByKey().on("child_changed", function (dataChanged) {
                // vm.roomGame.members[dataChanged.key]['score'] = dataChanged.val();
                if(dataChanged.key !== 'turn' && dataChanged.key !== 'people') {
                    vm.roomGame.members[dataChanged.key]['score'] = dataChanged.val().score;
                    alert(dataChanged.key + " " + dataChanged.val());
                    // alert(JSON.stringify(vm.roomGame.members));
                }
            }
            );
        }

        function sendMessage(kindOfListener, playerId, questionId) {
            var key = playerId;

            var update = {};

            update['/LISTENER/' + kindOfListener + '/' + key] = {
                from: vm.thisPlayer.id,
                name: vm.thisPlayer.name,
                question: questionId,
                time: Date.now()
            };
            db.ref().update(update);

        }

        function deleteListener(kindOfListener, receiverId) {
            var updates                                               = {};
            updates['/LISTENER/' + kindOfListener + '/' + receiverId] = null;
            db.ref().update(updates);
        }

        //set Online_free/online_busy/offline status and listển
        function setStatus(status, playerid) {

            var updateVote = db.ref("USER/" + playerid + "/status");
            updateVote.transaction(function () {
                return status;
            });

            var update                             = {};
            update["USER/" + playerid + "/status"] = 0;
            db.ref().onDisconnect().update(update);
        }


        $scope.setOffline = function (playerid) {
            setStatus(IS_OFFLINE, playerid);
        };

        $scope.inviteUser = function (receiverId) {
            sendMessage('INVITE_TO', receiverId, 2);
        };

        function removeNotification() {
            vm.mesageSender = null;
        }

        function removeDisplayChallegersQueue(senderId, questionId) {
            vm.challagers.forEach(function (item, index) {
                if (item.senderId === senderId && item.questionId === questionId) {
                    vm.challagers.splice(index, 1);
                }
            });
            // alert(JSON.stringify(vm.challagers));
            // vm.challagers = challagers;
        }

        $scope.refuseInvite = function (senderId, questionId) {
            sendMessage('REFUSE_INVITE_TO', senderId, questionId);

            var receiverId = vm.thisPlayer.id;

            deleteListener(INVITE_TO, receiverId);

            removeNotification();
            removeDisplayChallegersQueue(senderId, questionId);
        };

        function createRoom(senderId, receiverId, callback) {
            var update = {};
            var key    = senderId + '+' + receiverId;

            // var senderScore                                  = ;
            update['/LISTENER/ROOM/' + key + '/' + senderId] = {score: 0};
            db.ref().update(update);

            // var receiverScore                                  = ;
            update['/LISTENER/ROOM/' + key + '/' + receiverId] = {score: 0};
            db.ref().update(update);
            callback(senderId, receiverId);
        }

        function listenToOpponentScore(roomKey, opponentId) {
            db.ref('LISTENER').child('ROOM/' + roomKey + '/' + opponentId + '/score').on("child_changed", function (snapshot) {
                vm.opponent.currentScore += Math.round(snapshot.val());
            });
        }

        function listenToOpponentGameStatus(roomKey, opponentId) {
            db.ref('LISTENER').child('ROOM/' + roomKey + '/' + opponentId + '/status').on("child_changed", function (snapshot) {
                var x = snapshot.val();
                alert(snapshot.val());
                if (snapshot.val() !== null && snapshot.val() !== 'end') {
                    db.ref('LISTENER').child('ROOM/' + roomKey + '/' + opponentId + '/score').once('value').then(function (snapshot) {
                        alert('other done');
                        otherdone = true;
                        vm.opponent.currentScore += Math.round(snapshot.val());
                    });
                }
            });
        }


        // $scope.agreeToPlay = function (senderId, senderName, receiverId, questionId) {
        $scope.agreeToPlay = function (senderId, senderName, receiverId, questionId) {
            // receiverId = receiverId;
            // alert('Create room for ' + senderId + ' vs ' + receiverId + ' question ' + questionId);
            deleteListener(INVITE_TO, receiverId);
            removeFromChallegerQueue(receiverId, senderId, questionId);
            removeDisplayChallegersQueue(senderId, questionId);
            removeNotification();
            createRoom(senderId, receiverId, function (senderId, receiverId) {
                sendMessage(AGREE_INVITE_TO, senderId, questionId);
                play(senderId, senderName, senderId + '+' + receiverId);
            });
        };
        var currentChoice;
        $scope.answerIs    = function (answer, roomKey, me, event) {
            $scope.isDisabled = true;
            currentChoice     = event.currentTarget.id;
            var cA            = vm.question.a;
            if (parseInt(event.currentTarget.id) === cA) {
                angular.element('#' + event.currentTarget.id).addClass('cAnswer');
            } else {
                angular.element('#' + event.currentTarget.id).addClass('wAnswer');
            }
            noupdate = {};
            if (answer == vm.question.a) {
                answer = vm.countdown;
            } else {
                answer = 0;
            }
            noupdate['/LISTENER/ROOM/' + roomKey + '/' + me + '/score'] = answer + changingNumber();
            db.ref().update(noupdate);
            vm.thisPlayer.currentScore += answer;
            anwerQuestion(++cQuestion, 2);
        };
    }
]);