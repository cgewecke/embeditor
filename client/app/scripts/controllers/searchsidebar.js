'use strict';

/**
 * @ngdoc function
 * @name embeditor.controller:SearchSidebarCtrl
 * @description
 * # SearchSidebarCtrl
 * Controller of the embeditor
 */
var sb_debug, sb_debugII, sb_debugIII;
angular.module('embeditor')
  
  .controller('SearchSidebarCtrl', ['$scope', 'youTubeDataAPI', '$mdSidenav', '$ui', 
    function ($scope, youTubeDataAPI, $mdSidenav, $ui ) {
   
    var self = this;
    self.youTube = youTubeDataAPI;
    self.mdSidenav = $mdSidenav; 

    // Toggles sidebar open if closed
    $scope.$on('youTubeDataAPI:query', function(event, msg){
      if (!self.mdSidenav('search').isOpen()){
        self.mdSidenav.exists = true;
        $scope.searchText = '';
        self.mdSidenav('search').toggle();
      }
    });
  }])

  .directive('sidebarSelectOption', ['youTubeDataAPI', '$timeout', 
      function(youTubeDataAPI, $timeout ){
      return {
         restrict: '',
         link: function(scope, elem, attrs){
            
            elem.bind('click', function(event){
               youTubeDataAPI.getAgain(scope.previous);
            });

            elem.bind('keydown', function(event){
               if (event.which == '13'){
                  youTubeDataAPI.getAgain(scope.previous);
               }
            })
           
         }
      }
  }]);
