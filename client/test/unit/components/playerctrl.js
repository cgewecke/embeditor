
var pct_debug, pct_debugII;

describe('Controller: PlayerCtrl/Player-Section', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));
  beforeEach(module('templates'));

  var scope, compile, interval, timeout, playerAPI, code, player, ctrl, YT;
  var video = { seconds: 414 };
      
  beforeEach(inject(function ($controller, $rootScope, $compile, $interval, $timeout) {

     scope = $rootScope.$new();
     compile = $compile;
     interval = $interval;
     timeout = $timeout;
     
     ctrl = $controller("PlayerCtrl", {$scope: scope });
     YT = $controller("mockYTPlayerAPI", {$scope: scope });
     YT.attachMockAPI(ctrl.API);

     player = angular.element('<embeditor-section-app></embeditor-section-app>');
     compile(player)(scope);
     scope.$digest();
  }));

  // ------------  Player Section - DOM/Directive Spec ------------------
  describe('timestamp button', function(){

    it('should be wired correctly', function(){
      var btn = player.find('ng-md-icon#timestamp-btn');
      var ctrl_as = btn.controller();
      spyOn(ctrl_as, 'startFromTimestamp');
      btn.triggerHandler('click');
      expect(ctrl_as.startFromTimestamp).toHaveBeenCalled();
    })
  });

  describe('player loading cover', function(){
    it('should show/hide while API.initializing is true/false', function(){
      var cover = player.find('div#player-loading-screen');
      pct_debug = cover;
      var ctrl_as = cover.scope().player;

      expect(cover.hasClass('visible')).toBe(true);
      
      ctrl_as.API.initializing = false;
      scope.$apply();
      expect(cover.hasClass('visible')).toBe(false);
    })
  })

  // ----------- PlayerCtrl Logic Spec ----------------------------------
  describe('startFromTimestamp()', function(){
    it('should set startpoint and seek player to the current timestamp (tapehead) value', function(){
      
      var btn = player.find('ng-md-icon#timestamp-btn');
      var ctrl_as = btn.scope().player;
      YT.attachMockAPI(ctrl_as.API);
      ctrl_as.API.load(video);

      spyOn(ctrl_as.API, 'seek');

      ctrl_as.API.timestamp = 100;
      btn.triggerHandler('click');
      timeout.flush();
      
      expect(ctrl_as.API.startpoint.val).toEqual(100);
      expect(ctrl_as.API.seek).toHaveBeenCalledWith(100);

    });
  });

  describe('API.currentRate watch', function(){
    it('should change the playback rate in the player on value change', function(){

      spyOn(ctrl.API, 'setRate');
      ctrl.API.load(video);
      ctrl.API.videoLoaded = true;
      ctrl.API.currentRate = 0.5;

      scope.$apply();
      expect(ctrl.API.setRate).toHaveBeenCalledWith(0.5);

    });

    it('should update codeGenerator rate option on value change', function(){
      spyOn(ctrl.code, 'set');
      ctrl.API.load(video);
      ctrl.API.videoLoaded = true;
      ctrl.API.currentRate = 0.5;

      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith("rate", 0.5);
    })
  });

  describe('API.loop watch', function(){
    it('should update codeGenerator loop option on value change', function(){
      spyOn(ctrl.code, 'set');
      ctrl.API.load(video);
      
      ctrl.API.loop = false;
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith("loop", false);
      
      ctrl.API.loop = true;
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith("loop", true);

    });
  });

  describe('API.mute watch', function(){

    it('should mute/unmute the player if the players sound is on/off', function(){
      spyOn(ctrl.API, 'silence');
      spyOn(ctrl.API, 'noise');
      ctrl.API.videoLoaded = true;
      
      ctrl.API.mute = true;
      scope.$apply();
      expect(ctrl.API.silence).toHaveBeenCalled();

      ctrl.API.mute = false;
      scope.$apply();
      expect(ctrl.API.noise).toHaveBeenCalled(); 

    })

    it('should update codeGenerator mute option on value change', function(){
      spyOn(ctrl.code, 'set');
      ctrl.API.videoLoaded = true;
      
      ctrl.API.mute = true;
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith("mute", true);
      
      ctrl.API.mute = false;
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith("mute", false);
      
    });
  });

  describe('API.auto watch', function(){
    it('should update codeGenerator auto option on value change', function(){
      spyOn(ctrl.code, 'set');
  
      ctrl.API.autoplay = true;
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith("autoplay", true);

      ctrl.API.autoplay = false;
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith("autoplay", false);
    });
  });
  
  describe('API video load listener', function(){
    it('should init code generator options with new video id when new video is loaded', function(){
      spyOn(ctrl.code, 'set');
      ctrl.API.load({seconds: 414, videoId: 'abcdef'});
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith('videoId', 'abcdef');
    })
  });
  
  describe('API.startpoint, endpoint change listener', function(){
    it('should update codeGenerator start/end point options on when changed', function(){
      spyOn(ctrl.code, 'set');
      ctrl.API.load(video);

      ctrl.API.setStartpoint(10);
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith('start', 10);

      ctrl.API.setEndpoint(400);
      scope.$apply();
      expect(ctrl.code.set).toHaveBeenCalledWith('end', 400);
      
    });
  });
})