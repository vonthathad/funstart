angular.module('auth').controller('ActionController',['$scope','$rootScope','MissionsService','$location','AuthSignin',
    function($scope,$rootScope,MissionsService,$location,AuthSignin){
        $scope.mode = $location.search().mode;
        $scope.new = {};
        $scope.submitting = false;
        $scope.onReset = function() {

        }

}]);
angular.module('auth').controller('AuthController',['$scope','AuthSignout','AuthFacebook','AuthSignup','AuthSignin','MissionsService','$rootScope','$http',
    function($scope,AuthSignout,AuthFacebook,AuthSignup,AuthSignin,MissionsService,$rootScope,$http){
        $scope.signupModel = {};
        $scope.submitting = false;
        $scope.onSignOut = function(){
            AuthSignout.get(function () {
                localStorage.removeItem('token');
                sessionStorage.removeItem('user');
                window.location.href = '/';
            },function () {
                //thu lai
            });
        };
        $scope.action = {};
        $scope.signinModel = {};
        $scope.onLoginFacebook = function(){
            $scope.errorSignin = null;
            $scope.submitting = true;
            AuthFacebook.get(function(res){
                $rootScope.user = res.data;
                $rootScope.missions = MissionsService;
                $rootScope.missions.loadMissions($rootScope.user._id);
                localStorage.setItem('token',res.data.token);
                sessionStorage.setItem('user',JSON.stringify(res.data));
                $scope.submitting = false;
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
                $scope.cancel();
            });
        };
        $scope.onSignup = function(){
            $scope.submitting = true;
            $scope.errorSignup = null;

            AuthSignup.save(signupModel,function(res){
                $rootScope.user = res.data;
                $rootScope.missions = MissionsService;
                $rootScope.missions.loadMissions($rootScope.user._id);
                localStorage.setItem('token',res.data.token);
                sessionStorage.setItem('user',JSON.stringify(res.data));
                $http.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.token;
                $scope.submitting = false;
                $scope.cancel();
            },function(err){
                $scope.errorSignin = err.message;
                $scope.submitting = false;
            });
        };
        $scope.onSignin = function(){
            $scope.submitting = true;
            $scope.errorSignin = null;
            console.log('here');
            AuthSignin.save(signinModel,function(res){
                $rootScope.user = res.data;
                localStorage.setItem('token',res.data.token);
                sessionStorage.setItem('user',JSON.stringify($rootScope.user));
                $rootScope.missions = MissionsService;
                $rootScope.missions.loadMissions($rootScope.user._id);
                $scope.submitting = false;
                $scope.cancel();
            },function(err){
                $scope.errorSignin = err.message;
                $scope.submitting = false;
            });
        };
}]);
