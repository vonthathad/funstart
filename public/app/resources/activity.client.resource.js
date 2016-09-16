
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
        "updateScore": function (data,callback) {
            console.log(data);
            var activity = new Activities(data);
            activity.$save(function(res){
                if(callback) callback(res);
            },function(err){
                
            });
        }
    };
    return self;
    
});