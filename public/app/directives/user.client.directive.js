/**
 * Created by andh on 8/9/16.
 */

angular.module('funstart').directive('userCard', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/templates/userCard.tmpl.html',
        scope: {
            'data' : '=',
            'checkUser' : '&',
            'addFriend' : '&',
            'follow' : '&',
            'unfollow' : '&',
            'updateFriendList' : '&'
        },
        controller: function ($scope,$routeParams) {
            if($routeParams.gameId){
                $scope.faded = true;
            } else {
                $scope.faded = false;
            }
            $scope.$on("$routeChangeStart", function(event, next, current) {
                if('gameId' in next.params){
                   $scope.faded = true;
                } else {
                   $scope.faded = false;
                }
            });
            $scope.imagePath = 'img/bgstat.jpg';
            
        }
    }
});

angular.module('funstart').directive('missionCard', function () {
    return {
        templateUrl: 'app/templates/missionCard.tmpl.html',
        scope: {
            item: "="
        }
    }
});
angular.module('funstart').directive('friendCard', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/templates/friendCard.tmpl.html',
        scope: {
            'mode' : '=',
            'item' : '=',
            'gameType' : '=',
            'follow' : '&',
            'invite': '&',
            'unfollow' : '&',
            'kick': '&',
            'isHost': '=',
            'statusClass' : '&',
            'updateList' : '&'
        },
        controller: function ($scope) {
            // $scope.onFollow = function(){
            //     $scope.follow({input: $scope.item,callback: function(){
            //         console.log('vo callback',$scope.updateList);
            //         $scope.updateList(true,$scope.item);
            //     }})
            // }
            // $scope.onUnfollow = function(){
            //     console.log('vo day');
            //     $scope.unfollow({input: $scope.item,callback: function(){
            //         console.log('vo callback');
            //         $scope.updateList(false,$scope.item);
            //     }})
            // }
            $scope.updateFollow = function(){
                $scope.updateList({bool: true,input: $scope.item});
                $scope.isLoading = false;
            };
            $scope.updateUnfollow = function(){
                $scope.updateList({bool: false,input: $scope.item});
                $scope.isLoading = false;
            }
        }
    }
});

