'use strict';

/**
 * @ngdoc overview
 * @name cvApp
 * @description
 * # cvApp
 *
 * Main module of the application.
 */
angular
  .module('cvApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngSanitize', 'ngTouch', 'ui.router'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state("main", {
        url: "/",
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .state("skills", {
        url: "/",
        templateUrl: 'views/skills.html',
        controller: 'SkillsCtrl'
      })
      .state("contact", {
        url: "/",
        templateUrl: 'views/contact.html',
        controller: 'ContactCtrl'
      })

    $urlRouterProvider.otherwise("/");
  });
