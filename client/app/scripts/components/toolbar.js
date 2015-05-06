'use strict';

/**
 * @ngdoc function
 * @name embeditor.controller:ToolbarCtrl
 * @description
 * # ToolbarCtrl
 * # Injects $ui into toolbar scope.
 * Controller of the embeditor
 */
var tb_debug;
angular.module('embeditor')
  .controller('ToolbarCtrl', ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {

   // $mdSidenav will throw exceptions before sidenav is opened the first time
    this.sideNavIsOpen = function(){ 
      if ($mdSidenav.exists && $mdSidenav('search').isOpen()){
         return true;
      } else {
         return false; 
      }    
    }

  }]);
