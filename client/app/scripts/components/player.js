'use strict';

/**
 * @ngdoc function
 * @name embeditor.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the embeditor
 */
angular.module('embeditor')
  .controller('PlayerCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
