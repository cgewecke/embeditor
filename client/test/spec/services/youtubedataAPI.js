'use strict';

describe('Service: youTubeDataAPI', function () {

  // load the service's module
  beforeEach(module('embeditor'));

  // instantiate service
  var youTubeDataAPI;
  beforeEach(inject(function (_youTubeDataAPI_) {
    youTubeDataAPI = _youTubeDataAPI_;
  }));

  it('should do something', function () {
    expect(!!youTubeDataAPI).toBe(true);
  });

});
