angular.module('funstart').factory('$FB', ['$window', function($window) {
    return {
        init: function(fbId) {
            if (fbId) {
                this.fbId = fbId;
                $window.fbAsyncInit = function() {
                    FB.init({
                        appId: fbId,
                        channelUrl: 'app/channel.html',
                        status: true,
                        xfbml: true
                    });
                    if(document.getElementById('facebook-like')){
                        console.log('TH1');
                        document.getElementById('facebook-like').innerHTML = '<div class="fb-page" data-href="https://www.facebook.com/FunStart/" data-small-header="true" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true"><blockquote cite="https://www.facebook.com/FunStart/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/FunStart/">Fun Start</a></blockquote></div>';
                    }
                };
                (function(d) {
                    var js,
                        id = 'facebook-jssdk',
                        ref = d.getElementsByTagName('script')[0];
                    if (d.getElementById(id)) {
                        return;
                    }

                    js = d.createElement('script');
                    js.id = id;
                    js.async = true;
                    js.src = "//connect.facebook.net/en_US/all.js";

                    ref.parentNode.insertBefore(js, ref);
                }(document));
            } else {
                throw ("FB App Id Cannot be blank");
            }
        }
    };

}]);