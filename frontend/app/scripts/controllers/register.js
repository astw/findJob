'use strict';

angular.module('psJwtApp')
  .controller('RegisterCtrl', function ($scope,$rootScope, $http, alert, authToken) {
    $scope.submit = function(){
        console.log("submit");
        var url  ="http://localhost:3000/register";
        var user ={
            email: $scope.email,
            password :$scope.password
        };

        $http.post(url, user)
            .success(function(res){
                console.log("good");
                authToken.setToken(res.token);
            })
            .error(function(err){
                console.log("bad");
                alert("warning", "Oops", "Could not register");
            });
    };
  });
