(function(){

  'use strict';

  angular.module('embeditor.components.player', ['embeditor.services.youtubePlayerAPI'])
    
    .controller('PlayerCtrl', playerCtrl );
    
    function playerCtrl($scope, youtubePlayerAPI, $mdSidenav){
      var self = this;

      self.alignment = 'center center';
      self.youtube = youtubePlayerAPI;

      // Move player block over to right side of page on sideNavOpen
      // return on sidenNav closed. Exception gets thrown unless
      // sideNav has been instantiated the first time.
      self.sideNavIsOpen = function(){ 
         if ($mdSidenav.exists && $mdSidenav('search').isOpen()){
            return 'end center';
         } else {
            return 'center center';  
         }
      }
    };

    playerCtrl.$inject = ['$scope', 'youtubePlayerAPI', '$mdSidenav'];

})();

