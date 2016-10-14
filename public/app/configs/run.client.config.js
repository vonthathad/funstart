angular.module('funstart').config([
    '$httpProvider', '$sceDelegateProvider', function ($httpProvider, $sceDelegateProvider) {
        if (window.user){
            $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + user.token;
        } else if (localStorage.getItem('token')) {
            console.log('zô token');
            $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        } else {
            console.log('zô đây');
            $httpProvider.defaults.headers.common['Authorization'] = 'Bearer CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My';
        }
        $sceDelegateProvider.resourceUrlWhitelist(['**']);
        // $httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS';
    }
]);
angular.module('funstart').run(['$FB','AuthToken','Topics','$rootScope','$mdSidenav','$mdDialog',function($FB,AuthToken,Topics,$rootScope,$mdSidenav,$mdDialog){
    $rootScope.login = 'guest';
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
        $( 'body' ).on( 'mousewheel DOMMouseScroll','.scrollable', function ( e ) {
            var e0 = e.originalEvent,
                delta = e0.wheelDelta || -e0.detail;

            this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
            e.preventDefault();
        });
        $(window).scrollTop(0);
        $mdSidenav('left').close();
        $mdSidenav('right').close();
        if(current && ('gameId' in current.params) && ('gameId' in next.params) && current.params!=next.params){
            var tmpLink = '/sources/game/' + current.params.gameId;
            $('script').each(function(i,e){
                if($(e).attr('src') && $(e).attr('src').indexOf(tmpLink)>=0){
                    $(e).remove();
                }
            });
            $('link').each(function(i,e){
                if($(e).attr('href') && $(e).attr('href').indexOf(tmpLink)>=0){
                    $(e).remove();
                }
            });
            $('style').each(function(i,e){
                if($(e).attr('data-href') && $(e).attr('data-href').indexOf(tmpLink)>=0){
                    $(e).remove();
                }
            });
        };
    });
    $FB.init('170584416691811');
    $rootScope.topics = [
        {
            "_id" : 0,
            "icon" : "ion-ios-bolt",
            "name" : "Nhanh nhạy"
        },
        {
            "_id" : 1,
            "icon" : "ion-ios-infinite",
            "name" : "Linh hoạt"
        },
        {
            "_id" : 2,
            "icon" : "ion-ios-lightbulb",
            "name" : "Trí nhớ"
        },
        {
            "_id" : 3,
            "icon" : "ion-ios-eye",
            "name" : "Tập trung"
        },
        {
            "_id" : 4,
            "icon" : "ion-ios-cog",
            "name" : "Trí tuệ"
        }
    ];
    if(window.user){
        $rootScope.user = user;
        if($rootScope.user.provider == 'facebook'){
            $rootScope.login = 'facebook';
        } else {
            $rootScope.login = 'local';
        }

        // sessionStorage.setItem('user',JSON.stringify($rootScope.user));
        try
        {
            localStorage.setItem('token',$rootScope.user.token);
        }
        catch (error)
        {
            return false;
        }
        initSocket();
        // $rootScope.missions = MissionsService;
        // $rootScope.missions.loadMissions($rootScope.user._id);
    }
    // else if (sessionStorage.getItem('user')){
    //     $rootScope.user = JSON.parse(sessionStorage.getItem('user'));
    //     // $rootScope.missions = MissionsService;
    //     // $rootScope.missions.loadMissions($rootScope.user._id);
    //     //doan nay nho set online
    //     initSocket();
    // }
    else if(localStorage.getItem('token')){
        AuthToken.get(function(res){
            $rootScope.user = res.data;
            if($rootScope.user.provider == 'facebook'){
                $rootScope.login = 'facebook';
            } else {
                $rootScope.login = 'local';
            }
            // sessionStorage.setItem('user',JSON.stringify($rootScope.user));
            // $rootScope.missions = MissionsService;
            // $rootScope.missions.loadMissions($rootScope.user._id);
            initSocket();
            //doan nay nho set online
        },function (err) {
            $rootScope.user = null;
            localStorage.removeItem('token');
            location.reload();
        })
    }
    function initSocket(){
        socket.emit('user', $rootScope.user.token);
        socket.on('user',function(bool){
            if(bool){
                console.log('da nhan ping tu server');
                $rootScope.readyBattle = true;
                $rootScope.$apply();
            }
        });
        socket.on('invite',function(data){
            console.log(data);
            $mdDialog.show({
                    controller: ['$scope','$mdDialog','$location',function($scope, $mdDialog,$location) {
                        $scope.hide = function() {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                        $scope.data = data;
                        $scope.goRoom = function(){
                            $location.path('/game/'+$scope.data.game._id);
                            $location.search({"roomId" : $scope.data.room,"utm_campaign": "tracking","utm_source":"invite","utm_medium":"login"});
                            $mdDialog.cancel();
                        }
                    }],
                    templateUrl: 'app/templates/inviteDialog.tmpl.html',
                    parent: angular.element(document.body),
                    clickOutsideToClose:true
                })
                .then(function() {

                }, function() {

                });
        })
    };
}]);