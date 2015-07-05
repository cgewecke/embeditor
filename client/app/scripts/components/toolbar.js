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
  .controller('ToolbarCtrl', toolbarCtrl);

  function toolbarCtrl($scope, layoutManager ){

   var self = this;

   self.ready = false;
   self.layout = layoutManager;

   $scope.$on('YTPlayerAPI:ready', function(){
      self.ready = true;
   });
   
  }
  toolbarCtrl.$inject = ['$scope', 'layoutManager'];

})();
