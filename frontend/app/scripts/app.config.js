angular
    .module('psJwtApp').config(function($stateProvider, $urlRouterProvider){
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("register",{
            url:"/register",
            templateUrl:"/views/register.html",
            controller:"RegisterCtrl"
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

    });