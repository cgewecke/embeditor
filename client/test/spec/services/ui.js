'use strict';

describe('Service: ui', function () {

  // load the service's module
  beforeEach(module('embeditor'));

  // instantiate service
  var ui;
  beforeEach(inject(function (_ui_) {
    ui = _ui_;
  }));

  it('should do something', function () {
    expect(!!ui).toBe(true);
  });

});
