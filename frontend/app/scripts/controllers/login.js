'use strict';

/**
 * @ngdoc function
 * @name psJwtApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the psJwtApp
 */
angular.module('psJwtApp')
  .controller('LoginCtrl', function ($scope,auth, alert) {
        $scope.submit = function(){
           auth.login($scope.email,$scope.password)
                .success(function(res){
                    alert("success", "Welcome", "Thanks for coming back." );
                })
                .error(function(err){
                    console.log("bad");
                    alert("warning", "Something went wrong:",  err.message);
                });
        };
  });
