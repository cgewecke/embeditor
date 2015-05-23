
describe('Controller: PlayerCtrl', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));
  beforeEach(module('templates'));

  var scope, compile, interval, timeout, playerAPI, code, player, ctrl, YT;
      
  beforeEach(inject(function ($controller, $rootScope, $compile, $interval, $timeout, 
                              _youtubePlayerAPI_, codeGenerator ) {

     scope = $rootScope.$new();
     compile = $compile;
     interval = $interval;
     timeout = $timeout;
     playerAPI = _youtubePlayerAPI_;
     code = codeGenerator;

     ctrl = $controller('PlayerCtrl', {$scope: scope });
     YT = $controller("mockYTPlayerAPI", {$scope: scope });

     YT.attachMockAPI(playerAPI);

     player = angular.element('<embeditor-section-player-controls></embeditor-section-player-controls>');
     compile(player)(scope);
     scope.$digest();
  }));

  describe('startFromTimestamp()', function(){
    it('should set startpoint to the current timestamp (tapehead) value', function(){
      console.log('TEST NOT IMPLEMENTED: PlayerCtrl');
    });

    it('should seek to new startpoint', function(){
      console.log('TEST NOT IMPLEMENTED: PlayerCtrl');
    });
  });

  describe('API.currentRate watch', function(){
    it('should change the playback rate in the player on value change', function(){
      console.log('TEST NOT IMPLEMENTED: PlayerCtrl');
    });

    it('should update codeGenerator rate option on value change', function(){
      console.log('TEST NOT IMPLEMENTED: PlayerCtrl');
    })
  });

  describe('API.loop watch', function(){
    it('should update codeGenerator loop option on value change', function(){
      console.log('TEST NOT IMPLEMENTED: PlayerCtrl');
    });
  });

  describe('API.mute watch', function(){
    it('should update codeGenerator mute option on value change', function(){
      console.log('TEST NOT IMPLEMENTED: PlayerCtrl');
    });
  });

  describe('API.startpoint, endpoint listener', function(){
    it('should update codeGenerator start/end point options on value change', function(){
      console.log('TEST NOT IMPLEMENTED: PlayerCtrl');
    });
  });
})