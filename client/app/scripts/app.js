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
    'ngMaterial',
    'ngMdIcons',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    
    'embeditor.components.embed',
    'embeditor.components.embedcodedialog',
    'embeditor.components.player',
    'embeditor.components.rangefinder',
    'embeditor.components.searchbox',
    'embeditor.components.searchsidebar',
    'embeditor.components.toolbar',
    'embeditor.services.codeGenerator',
    'embeditor.services.cyclopseDataAPI',
    'embeditor.services.layoutManager',
    'embeditor.services.youTubeDataAPI',
    'embeditor.services.youtubePlayerAPI'
  ])
  .config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('amber', {'hue-1': '200'})
    .accentPalette('orange', {'hue-1': '500'})
    .backgroundPalette('grey')
  })
  .config(function ($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(true);
    
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html'
        //controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        //controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
