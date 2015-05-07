'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('embeditor', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMaterial',
    'ngMdIcons',
    'embeditor.components.player',
    'embeditor.components.searchbox',
    'embeditor.components.searchsidebar',
    'embeditor.services.youTubeDataAPI',
    'embeditor.services.youtubePlayerAPI'
  ])
  .config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-orange', {'hue-1': '50'})
    .accentPalette('amber', {'hue-1': '50'})
    .backgroundPalette('amber', {'hue-1': '50'})
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
