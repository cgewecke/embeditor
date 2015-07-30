var tb_debug;
'use strict';

/**
 * @ngdoc function
 * @name embeditor.controller:ToolbarCtrl
 * @description
 * # ToolbarCtrl
 */

(function(){

angular.module('embeditor.components.toolbar', [ 'embeditor.services.layoutManager' ])
  .controller('ToolbarCtrl', toolbarCtrl)
  .controller('FooterCtrl', footerCtrl);

  // -----------   Header Controller -----------------
  function toolbarCtrl($scope, layoutManager ){

   var self = this;

   self.ready = false;
   self.layout = layoutManager;

   // Toggles youtube search input to visible when
   // page load is complete.
   $scope.$on('YTPlayerAPI:ready', function(){
      self.ready = true;
   });
   
  }
  toolbarCtrl.$inject = ['$scope', 'layoutManager'];

  // ------------  Footer Controller -----------------
  function footerCtrl($scope, $window, youtubePlayerAPI, $mdDialog){
    
    var self = this;
    self.API = youtubePlayerAPI;
    $scope.mdDialog = $mdDialog;
    
    // Dialog opener for info icon
    self.info = function(){
      
      $mdDialog.show({
        clickOutsideToClose: true,  
        templateUrl: 'templates/info.html',
        controller: 'FooterCtrl'
        
      });
    };

    // Open cyclopse-on.tumblr.com in new tab
    self.tumblr = function(){
      $window.open('//apocyclopse.tumblr.com', '_blank');
    };

  };
  footerCtrl.$inject = ['$scope', '$window', 'youtubePlayerAPI', '$mdDialog'];

})();
