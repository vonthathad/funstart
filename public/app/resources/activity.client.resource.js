
/**
 * Created by lethanhtung on 8/11/16.
 */
angular.module('funstart').factory('Activities', ['$resource',
    function($resource) {
        return $resource('api/activities');
    }
]);
angular.module('funstart').service('ActivityService',function(Activities){
    var self = {
        "updateScore": function (obj,callback) {
            var activity = new Activities(obj);
            activity.$save(function(res){
                if(callback) callback(res);
            },function(err){
                
            });
        }
    };
    return self;
    
});