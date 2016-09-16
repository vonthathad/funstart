/**
 * Created by andh on 8/30/16.
 */
angular.module('funstart').directive('href', function() {
    return {
        compile: function(element) {
            element.attr('target', '_blank');
        }
    };
});
angular.module('funstart').directive('loadingCircle', function () {
    return {
        restrict: 'E',
        templateUrl: 'app/templates/loadingCircle.tmpl.html',
        scope: {
            isLoading : '='
        }
    }
});
angular.module('funstart').directive('navToolbar', function () {
    return {
        templateUrl: 'app/templates/navToolbar.tmpl.html'
    }
});
angular.module('funstart').directive('sliderRight', function () {
    return {
        templateUrl: 'app/templates/sliderRight.tmpl.html'
    }
});
angular.module('funstart').directive('sliderLeft', function () {
    return {
        templateUrl: 'app/templates/sliderLeft.tmpl.html',
        controller: function($scope){
            $scope.mode = 'friend';
        }
    }
});