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
    .constant('API_URL', "http://localhost:3000/");