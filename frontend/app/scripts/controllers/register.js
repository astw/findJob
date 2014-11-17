'use strict';

angular.module('psJwtApp')
  .controller('RegisterCtrl', function ($scope, $http, alert) {
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
            })
            .error(function(err){
                console.log("bad");
                alert("warning", "Oops", "Could not register");
            });
    };
  });
