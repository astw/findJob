angular
    .module('psJwtApp').config(function($stateProvider, $urlRouterProvider, $httpProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("register",{
            url:"/register",
            templateUrl:"/views/register.html",
            controller:"RegisterCtrl"
            })
            .state("login",{
                url:"/login",
                templateUrl:"/views/login.html",
                controller:"LoginCtrl"
            })
            .state("logout",{
                url:"/logout",
                templateUrl:"/",
                controller:"LogoutCtrl"
            })
            .state("jobs",{
                url:"/jobs",
                controller:"JobsCtrl",
                templateUrl:"/views/jobs.html"
            })
            .state("main",{
                url:"/",
                templateUrl:"/views/main.html"
            });

            $httpProvider.interceptors.push("authInterceptor");

    })
    .constant('API_URL', "http://localhost:3000/")
    .run(function($window){
        var param = $window.location.search.substring(1);
        console.log(param);
        if(param && $window.opener && $window.opener.location.origin === $window.location.origin){
            var pair = param.split("=");
            var code = decodeURIComponent(pair[1]);

            //pass value from pop up window to main window
            $window.opener.postMessage(code, $window.location.origin);
        }
    });
