/**
 * Created by andh on 8/9/16.
 */
angular.module('funstart').controller('UserController',['$scope','$rootScope','$location','UserInfoService','SuggestService','FriendsService',function($scope,$rootScope,$location,UserInfoService,SuggestService,FriendsService){
    $scope.userInfo = UserInfoService;
    $scope.friends = FriendsService;
    $scope.suggest = SuggestService;
    $scope.mode = 'friend';
    $scope.changeMode = function(){
        $scope.mode = ($scope.mode=='friend')?$scope.mode='search':$scope.mode='friend';
        console.log($scope.mode);
    };
    $scope.checkUser = function(){
        if($rootScope.user && (!$scope.username || $rootScope.user.username == $scope.username)){
            return 1;
        } else if ($rootScope.user && ($scope.username || $rootScope.user.username != $scope.username)){
            return 2;
        } else {
            return 0;
        }
    }
    var isExist = function(arr,it){
        console.log(arr);
        var temp = false;
        angular.forEach(arr,function(e){
            console.log(e);
            if(e == it) {
                temp = true;
                return true;
            }
        })
        return temp;
    }
    $scope.$on("$routeChangeStart", function(event, next, current) {
        if($location.path().indexOf('user')){
            $scope.username = $location.path().split('user/')[1];
        } else {
            $scope.username = null;
        }
        if('username' in next.params){
            if($scope.data && $scope.data.username != next.params.username){
                $scope.userInfo.loadUser(next.params.username,function(){
                    $scope.data = $scope.userInfo.data;
                    $scope.reloadFriendList();
                    $scope.data.isFriend = isExist($rootScope.user.friends,$scope.data._id);
                    drawPoint($scope.data);
                });
            }
        } else {
            $scope.data = $rootScope.user;
            $scope.reloadFriendList();
            drawPoint($scope.data);
        }

    });
    $rootScope.$watch('$root.user', function () {
        if($location.path().indexOf('user')<0){
            $scope.data = $rootScope.user;
            $scope.reloadFriendList();
            sessionStorage.setItem('user',JSON.stringify($rootScope.user));
            drawPoint($scope.data);
        }
    });
    $scope.updateFriendList = function(bool,obj){

        if(bool){
            $scope.friends.data.push(obj);
            $rootScope.user.friends.push(obj._id);
            sessionStorage.setItem('user',JSON.stringify($rootScope.user));
        } else {
            $scope.friends.data.splice($scope.friends.data.indexOf(obj),1);
            $rootScope.user.friends.splice($rootScope.user.friends.indexOf(obj._id),1);
            sessionStorage.setItem('user',JSON.stringify($rootScope.user));
        }

    };
    $scope.reloadFriendList = function(){
        $scope.friends.init();
        $scope.friends.userId = $scope.data._id;
        $scope.friends.loadFriends();
    }
    $scope.loadUser = function(){
        if($location.path().indexOf('user')){
            $scope.username = $location.path().split('user/')[1];
        } else {
            $scope.username = null;
        }
        $scope.suggest.init();
        $scope.friends.init();
        if($scope.username){
            $scope.userInfo.loadUser($scope.username,function(){
                $scope.data = $scope.userInfo.data;
                $scope.data.isFriend = isExist($rootScope.user.friends,$scope.data._id);
                $scope.friends.userId = $scope.data._id;
                $scope.friends.loadFriends();
                drawPoint($scope.data);
            });
        } else {
            $scope.friends.userId = $rootScope.user._id;
            $scope.friends.loadFriends();
            $scope.data = $rootScope.user;
            setTimeout(function () {
                drawPoint($scope.data)
            },500)
        }
        $scope.suggest.loadSuggest();
    }
}]);


angular.module('funstart').controller('AvatarController', ['$scope',
    function($scope) {
        $scope.myImage='';
        $scope.myCroppedImage='';
        $('#fileInput').change(function () {

            var file=this.files[0];
            var reader = new FileReader();
            reader.onload = function (evt) {
                $scope.$apply(function($scope){
                    $scope.myImage=evt.target.result;
                });
            };

            reader.readAsDataURL(file);
        })


        $scope.onClickBtn = function(){
            // File or Blob named mountains.jpg
            var file = dataUrltoBlob($scope.myCroppedImage,'jfvIjSUBj4fpCwgraPk5pgpRPSG3');

// Create the file metadata
            var metadata = {
                contentType: 'image/jpeg'
            };
            var storageRef = firebase.storage().ref();
            var user = firebase.auth().currentUser;
// Upload file and metadata to the object 'images/mountains.jpg'
            var uploadTask = storageRef.child('images').child('avatar').child('jfvIjSUBj4fpCwgraPk5pgpRPSG3.jpg').put(file, metadata);

// Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function(snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded;
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function(error) {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            break;

                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function() {
                    // Upload completed successfully, now we can get the download URL
                    var downloadURL = uploadTask.snapshot.downloadURL;
                    console.log(downloadURL);
                    user.updateProfile({
                        photoURL: downloadURL
                    }).then(function() {
                        console.log('suc');
                    }, function(error) {
                        console.log('err',error);
                    });
                });
        }
        var dataUrltoBlob = function (dataurl, name, origSize) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            var blob = new window.Blob([u8arr], {type: mime});
            blob.name = name;
            blob.$ngfOrigSize = origSize;
            return blob;
        };


    }
]);

function drawPoint(info){
    $('.hex-svg').html('');
    var point0 = {};
    var point1 = {};
    var point2 = {};
    var point3 = {};
    var point4 = {};
    var point5 = {};
    point0.y = 150 - parseInt(info.quick/1000*120);
    point0.x = 150;
    $('#hex-point-0').css('top',(point0.y-2) + 'px');
    $('#hex-point-0').css('left',(point0.x-2) + 'px');

    point1.y = 150 - parseInt(info.flex/1000*120/2);
    point1.x = 150 + parseInt(Math.sqrt(3)*info.flex/1000*120/2);
    $('#hex-point-1').css('top',(point1.y-2) + 'px');
    $('#hex-point-1').css('left',(point1.x-2) + 'px');

    $('.hex-svg').append('<svg><polyline points="'+(point0.x+1)+','+(point0.y+1)+' '+(point1.x+1)+','+(point1.y+1)+'"></polyline></svg>');

    point2.y = 150 + parseInt(info.memory/1000*120/2);
    point2.x = 150 + parseInt(Math.sqrt(3)*info.memory/1000*120/2);
    $('#hex-point-2').css('top',(point2.y-2) + 'px');
    $('#hex-point-2').css('left',(point2.x-2) + 'px');

    $('.hex-svg').append('<svg><polyline points="'+(point1.x+1)+','+(point1.y+1)+' '+(point2.x+1)+','+(point2.y+1)+'"></polyline></svg>');

    point3.y = 150 + parseInt(info.focus/1000*120);
    point3.x = 150;
    $('#hex-point-3').css('top',(point3.y-2) + 'px');
    $('#hex-point-3').css('left',(point3.x-2) + 'px');

    $('.hex-svg').append('<svg><polyline points="'+(point2.x+1)+','+(point2.y+1)+' '+(point3.x+1)+','+(point3.y+1)+'"></polyline></svg>');

    point4.y = 150 + parseInt(info.wit/1000*120/2);
    point4.x = 150 - parseInt(Math.sqrt(3)*info.wit/1000*120/2);
    $('#hex-point-4').css('top',(point4.y-2) + 'px');
    $('#hex-point-4').css('left',(point4.x-2) + 'px');

    $('.hex-svg').append('<svg><polyline points="'+(point3.x+1)+','+(point3.y+1)+' '+(point4.x+1)+','+(point4.y+1)+'"></polyline></svg>');

    point5.y = 150 - parseInt(info.fire/1000*120/2);
    point5.x = 150 - parseInt(Math.sqrt(3)*info.fire/1000*120/2);
    $('#hex-point-5').css('top',(point5.y-2) + 'px');
    $('#hex-point-5').css('left',(point5.x-2) + 'px');

    $('.hex-svg').append('<svg><polyline points="'+(point4.x+1)+','+(point4.y+1)+' '+(point5.x+1)+','+(point5.y+1)+'"></polyline></svg>');

    $('.hex-svg').append('<svg><polyline points="'+(point5.x+1)+','+(point5.y+1)+' '+(point0.x+1)+','+(point0.y+1)+'"></polyline></svg>');
}