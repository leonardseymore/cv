'use strict';

angular.module('cvApp')

  .controller('BodyCtrl', function ($scope, $state) {
    $scope.$state = $state;
    $scope.loading = false;

    $scope.$on("loader_show", function () {
      $scope.loading = true;
    });

    $scope.$on("loader_hide", function () {
      $scope.loading = false;
    });
  })

  .controller('MainCtrl', function ($scope) {
    $scope.age = new Date().getFullYear() - new Date("1984/05/20").getFullYear();
  })

  .controller('SkillsCtrl', function ($scope, $http) {
    $http.get('data/skills.json').success(function(data){
      $scope.data = data;
    });
  })

;
