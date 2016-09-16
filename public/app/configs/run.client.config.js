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
angular.module('funstart').run(function($FB,AuthToken,Topics,$rootScope,MissionsService,$mdSidenav){

    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
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
        }
    });
    $FB.init('170584416691811');
    if(sessionStorage.getItem('topics')){
        $rootScope.topics = JSON.parse(sessionStorage.getItem('topics'));
    } else {
        Topics.get(function(res){
            $rootScope.topics = res.data;
            sessionStorage.setItem('topics',JSON.stringify(res.data));
        })
    }
    if(window.user){
        $rootScope.user = user;
        sessionStorage.setItem('user',JSON.stringify($rootScope.user));
        localStorage.setItem('token',$rootScope.user.token);
        $rootScope.missions = MissionsService;
        $rootScope.missions.loadMissions($rootScope.user._id);
    } else if (sessionStorage.getItem('user')){
        $rootScope.user = JSON.parse(sessionStorage.getItem('user'));
        $rootScope.missions = MissionsService;
        $rootScope.missions.loadMissions($rootScope.user._id);
        //doan nay nho set online

    } else if(localStorage.getItem('token')){
        AuthToken.get(function(res){
            $rootScope.user = res.data;
            sessionStorage.setItem('user',JSON.stringify($rootScope.user));
            $rootScope.missions = MissionsService;
            $rootScope.missions.loadMissions($rootScope.user._id);

            //doan nay nho set online
        },function (err) {
            $rootScope.user = null;
        })
    }

});
