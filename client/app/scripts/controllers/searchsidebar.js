'use strict';

/**
 * @ngdoc function
 * @name embeditor.controller:SearchresultsCtrl
 * @description
 * # SearchresultsCtrl
 * Controller of the embeditor
 */
angular.module('embeditor')
  .controller('SearchSidebarCtrl', ['$scope', 'youTubeDataAPI', '$mdSidenav',
   function ($scope, youTubeDataAPI, $mdSidenav) {
   
   var self = this;
   self.youTube = youTubeDataAPI;
   self.mdSidenav = $mdSidenav;

   $scope.$on('youTubeDataAPI:query', function(event, msg){
      self.mdSidenav('searchSidebar').toggle();
   })
    
  }]);
