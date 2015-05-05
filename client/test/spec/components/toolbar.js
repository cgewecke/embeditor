'use strict';

describe('Controller: ToolbarCtrl', function () {

  // load the controller's module
  beforeEach(module('embeditor'));

  var ToolbarCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ToolbarCtrl = $controller('ToolbarCtrl', {
      $scope: scope
    });
  }));

});
