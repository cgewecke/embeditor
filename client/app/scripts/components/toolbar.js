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
    this.layout = layoutManager;
  }
  toolbarCtrl.$inject = ['$scope', 'layoutManager'];

})();
