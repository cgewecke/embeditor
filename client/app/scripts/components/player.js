(function(){
  'use strict';

  angular.module('embeditor.components.player', ['embeditor.services.youtubePlayerAPI'])
    
    .controller('PlayerCtrl', playerCtrl )
    .directive('embeditorSectionPlayerControls', embeditorSectionPlayerControls);

    // <embeditor-section-player-controls></embeditor-section-player-controls>
    // Outer tag for player controls that we can access for unit testing.
    function embeditorSectionPlayerControls(){ return{ templateUrl: 'templates/playercontrols.html' }};
    

    function playerCtrl($scope, youtubePlayerAPI, $mdSidenav){
      var self = this;

      self.alignment = 'center center';
      self.API = youtubePlayerAPI;
      $scope.API = youtubePlayerAPI;

      // Move player block over to right side of page on sideNavOpen
      // return on sidenNav closed. Exception gets thrown unless
      // sideNav has been instantiated the first time.
      self.sideNavIsOpen = function(){ 
         if ($mdSidenav.exists && $mdSidenav('search').isOpen()){
            return 'end center';
         } else {
            return 'center center';  
         }
      };

      // watch(API.currentRate): ng-modelled on the playback rates slider
      $scope.$watch('API.currentRate', function(newval, oldval){
        if (self.API.videoLoaded){
            self.API.setRate(newval);
        }
      });
    };

    playerCtrl.$inject = ['$scope', 'youtubePlayerAPI', '$mdSidenav'];

})();

