'use strict';

angular.module('cvApp')

  .controller('MainCtrl', function ($scope) {
    $scope.age = new Date().getFullYear() - new Date("1984/05/20").getFullYear();
  })

  .controller('SkillsCtrl', function ($scope, $http) {
    $http.get('data/skills.json').success(function(data){
      $scope.data = data;
    });
  })

  .controller('ContactCtrl', function ($scope) {

  })

;
