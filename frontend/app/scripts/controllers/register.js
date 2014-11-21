'use strict';

angular.module('psJwtApp')
  .controller('RegisterCtrl', function ($scope,alert, authToken) {
    $scope.submit = function(){
        authToken.register($scope.email,$scoope.password)
            .success(function(res){
                alert("success", "Account Created!", "Welcome, " + res.user.email);
            })
            .error(function(err){
                console.log("bad");
                alert("warning", "Oops", "Could not register");
            });
    };
  });
