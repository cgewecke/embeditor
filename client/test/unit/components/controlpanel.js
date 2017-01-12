"use strict"

var plt_debug, plt_debugII, plt_debugIII;

describe('Component: Control Panel', function () {

   // load the controller's module
   beforeEach(module('embeditor'));
   beforeEach(module('yt.player.mockapi'));
   beforeEach(module('templates'));


   var scope, compile, interval, timeout, playerAPI, player, ctrl, YT, dialog;
   
   beforeEach(inject(function ($controller, $rootScope, $compile, $interval, $timeout, _youtubePlayerAPI_ ) {

      scope = $rootScope.$new();
      compile = $compile;
      interval = $interval;
      timeout = $timeout;
      playerAPI = _youtubePlayerAPI_;
      playerAPI.initializing = false;

      ctrl = $controller('PlayerController', {$scope: scope });
      YT = $controller("mockYTPlayerAPI", {$scope: scope });

      YT.attachMockAPI(playerAPI);

      player = angular.element('<embeditor-section-player-controls></embeditor-section-player-controls>');
      compile(player)(scope);
      scope.$digest();
   }));

   // -------------------------------------- Play Button ------------------------------------------
   describe('play button', function(){
      var playBtn, playIcon, pauseIcon;

      beforeEach(function(){
         playBtn = player.find('button#play-btn');
         playIcon = player.find('ng-md-icon#play-icon');
         pauseIcon = player.find('ng-md-icon#pause-icon');
         
      })

      it('should start playing the video if video is paused, and display a pause icon', function(){
         
         spyOn(playerAPI, 'play');
         
         playerAPI.pause();
         playBtn.triggerHandler('click');
         scope.$apply();
         plt_debug = playerAPI;
         plt_debugII = playBtn;
         expect(playerAPI.play).toHaveBeenCalled();
         expect(playIcon.hasClass('ng-hide')).toBe(false);
         expect(pauseIcon.hasClass('ng-hide')).toBe(true);

      });

      it('should pause the video if the video is playing and display a play icon', function(){
         spyOn(playerAPI, 'pause');

         playerAPI.play();
         playBtn.triggerHandler('click');
         scope.$apply();
         
         expect(playerAPI.pause).toHaveBeenCalled();
         expect(playIcon.hasClass('ng-hide')).toBe(true);
         expect(pauseIcon.hasClass('ng-hide')).toBe(false);

      });

      it('should restart the video from the beginning if the playhead is within 250ms of clip endpoint', function(){
         playerAPI.setStartpoint(0);
         playerAPI.setEndpoint(5);

         YT.mockTime = 4.76;
         playerAPI.state = 'paused';

         playBtn.triggerHandler('click');
         scope.$apply();
         expect(YT.mockTime).toEqual(0);
      });
   });

   // -------------------------------------- Playback Speeds ------------------------------------------
   describe('playback speed setter', function(){
      var slider;
      beforeEach(function(){
         slider = player.find('md-slider#playback-speed-slider');
         
      });

      it('should have a default value of 1', function(){
         expect(slider.isolateScope().modelValue).toBe(1);
         
      });

      it('should be bound to the value of playerAPI.currentRate', function(){
         playerAPI.currentRate = 0.5;
         scope.$apply();
         expect(slider.isolateScope().modelValue).toBe(0.5);

         playerAPI.currentRate = 1.5;
         scope.$apply();
         expect(slider.isolateScope().modelValue).toBe(1.5);

      });

      
      it('should change the playback speed when the model is changed', function(){
         playerAPI.videoLoaded = true;
         spyOn(playerAPI, 'setRate');

         playerAPI.currentRate = 0.5;
         scope.$apply();
         expect(playerAPI.setRate).toHaveBeenCalledWith(0.5);
         
      })

      it('should be enabled/disabled if there are/are not playback speed options', function(){
         playerAPI.speeds = false;
         scope.$apply();
         expect(slider.attr('disabled')).toEqual('disabled');

         playerAPI.speeds = true;
         scope.$apply();
         expect(slider.attr('disabled')).toBeUndefined();
                  
      });

   });

   // -------------------------------------- Loop Toggle ------------------------------------------
   describe('loop switch', function(){
      var loopswitch, ngModel;
      beforeEach(function(){
         loopswitch = player.find('md-switch#loop-switch');
      });

      it('should be bound to the value of playerAPI.loop', function(){
        
         ngModel = loopswitch.controller('ngModel');
      
         playerAPI.loop = true;
         scope.$apply();
         expect(ngModel.$modelValue).toBe(true);

         playerAPI.loop = false;
         scope.$apply();
         expect(ngModel.$modelValue).toBe(false);

      });

      it('should be on by default', function(){
         ngModel = loopswitch.controller('ngModel');
         expect(ngModel.$modelValue).toBe(true);
      });

   })

   // -------------------------------------- Mute Toggle ------------------------------------------
   describe('mute switch', function(){
      
      var muteswitch, ngModel;
      beforeEach(function(){
         muteswitch = player.find('md-switch#mute-switch');
      });

      it('should be bound to the value of playerAPI.mute', function(){
        
         ngModel = muteswitch.controller('ngModel');
      
         playerAPI.mute = true;
         scope.$apply();
         expect(ngModel.$modelValue).toBe(true);

         playerAPI.mute = false;
         scope.$apply();
         expect(ngModel.$modelValue).toBe(false);

      });

      it('should be off by default', function(){
         ngModel = muteswitch.controller('ngModel');
         expect(ngModel.$modelValue).toBe(false);
      });
   });

   // -------------------------------------- Slider Reset ------------------------------------------
   describe('reset button', function(){
      it('should call playerAPI.reset() when clicked', function(){
         var reset = player.find("ng-md-icon#reset-button");
         spyOn(playerAPI, 'reset');
         reset.triggerHandler('click');
         expect(playerAPI.reset).toHaveBeenCalled();
      });
   })
   
   // ------------------------------------- Precision Seek ------------------------------------------
   describe('startpoint precision seek button block', function(){
      var back5, back1, backFrame, forward5, forward1, forwardFrame;
      beforeEach(function(){
         
         back1 = player.find('button#start-back-1sec-btn');
         backFrame = player.find('button#start-back-frame-btn');
         forwardFrame = player.find('button#start-fwd-frame-btn');
         forward1 = player.find('button#start-fwd-1sec-btn');
         

      })
      it('should have four seek buttons', function(){
         
         expect(back1.length).toBe(1);
         expect(backFrame.length).toBe(1);
         expect(forward1.length).toBe(1);
         expect(forwardFrame.length).toBe(1);
         
      });

      it('should wire the buttons correctly', function(){
         spyOn(playerAPI, 'start');
         
         back1.triggerHandler('click');
         expect(playerAPI.start).toHaveBeenCalledWith(-1);

         backFrame.triggerHandler('click');
         expect(playerAPI.start).toHaveBeenCalledWith(-(playerAPI.frameLength));

         forward1.triggerHandler('click');
         expect(playerAPI.start).toHaveBeenCalledWith(1);

         forwardFrame.triggerHandler('click');
         expect(playerAPI.start).toHaveBeenCalledWith(playerAPI.frameLength);

      })
   })

   describe('endpoint precision seek button block', function(){
      var back5, back1, backFrame, forward5, forward1, forwardFrame;
      var video = {
         duration: "6:55",
         seconds: 414, 
         videoId: "HcXNPI-IPPM"
      };
      beforeEach(function(){
         
         back1 = player.find('button#end-back-1sec-btn');
         backFrame = player.find('button#end-back-frame-btn');
         forwardFrame = player.find('button#end-fwd-frame-btn');
         forward1 = player.find('button#end-fwd-1sec-btn');
         
         playerAPI.load(video);
      })
      it('should have four seek buttons', function(){
         
         expect(back1.length).toBe(1);
         expect(backFrame.length).toBe(1);
         expect(forward1.length).toBe(1);
         expect(forwardFrame.length).toBe(1);
         
      });

      it('should wire the buttons to the playerAPI correctly', function(){
         spyOn(playerAPI, 'end');
         
         back1.triggerHandler('click');
         expect(playerAPI.end).toHaveBeenCalledWith(-1);

         backFrame.triggerHandler('click');
         expect(playerAPI.end).toHaveBeenCalledWith(-(playerAPI.frameLength));

         forward1.triggerHandler('click');
         expect(playerAPI.end).toHaveBeenCalledWith(1);

         forwardFrame.triggerHandler('click');
         expect(playerAPI.end).toHaveBeenCalledWith(playerAPI.frameLength);

      })
   })

   // -------------------------------------- End Time Display ------------------------------------------
   describe('endpoint display', function(){
      var disp;
      beforeEach(function(){
         disp = player.find('button#endpoint-display-btn')
      });
      
      it('should show the current value of the endpoint in format: HH:MM:SS.ss', function(){
         playerAPI.setEndpoint(10);
         scope.$apply();
         expect(disp.text().trim()).toEqual((10).toString().toHHMMSSss());
      });

      it('should call playerAPI.replayEnd() on click', function(){
         spyOn(playerAPI, 'replayEnd');
         disp.triggerHandler('click');
         expect(playerAPI.replayEnd).toHaveBeenCalled();
      });
   });

   // -------------------------------------- Start Time Display ------------------------------------------
   describe('startpoint display', function(){
      var disp;
      beforeEach(function(){
         disp = player.find('button#startpoint-display-btn')
      });
      
      it('should show the current value of the startpoint in format: HH:MM:SS.ss', function(){
         playerAPI.setStartpoint(10);
         scope.$apply();
         expect(disp.text().trim()).toEqual((10).toString().toHHMMSSss());
      });

      it('should call playerAPI.replayStart() on click', function(){
         spyOn(playerAPI, 'replayStart');
         disp.triggerHandler('click');
         expect(playerAPI.replayStart).toHaveBeenCalled();
      });
   })

   // -------------------------------------- Embed Code Dialog ------------------------------------------
   describe('embed code button', function(){
      it('should call dialog service open() when clicked', function(){
         var btn = player.find('button#embed-dialog-btn');
         var dialog = ctrl.dialog;

         spyOn(dialog, 'open');
      
         btn.triggerHandler('click');
         expect(dialog.open).toHaveBeenCalled(); 
         
      });
   });
   
   // -------------------------------------- Player Progress Bar ------------------------------------------
   describe('time bar', function(){
      var progress, bar, API, progressDiv;

      var video = {
         duration: "6:55",
         seconds: 414, 
         videoId: "HcXNPI-IPPM"
      };

      beforeEach( function(){
         progress = angular.element('<embeditor-player-time-bar></embeditor-player-time-bar>');
         compile(progress)(scope);
         scope.$digest();
         API = playerAPI;
         API.load(video);
         progressDiv = progress.find('div#time-bar');
      });

      it('should be wired correctly', function(){
         expect(progressDiv.attr('ng-mousemove')).toEqual('(!API.mobile) ? updateTimeDot($event): false');
         expect(progressDiv.attr('ng-mouseleave')).toEqual('(!API.mobile) ? hideTimeDot(): false');
         expect(progressDiv.attr('click')).toEqual('(API.mobile) ? seekVideoToTouch($event) : seekVideoToTimeDot()');
      })

      it('should correctly translate the x position of the click to time position in the video', function(){
         
         var divMidPoint = 854/2; // Default player width: 854px
         var videoMidPoint = 414/2; // Default video length: 414 sec.

         spyOn(API, 'setTapehead');
         progressDiv.scope().updateTimeDot({offsetX: divMidPoint });

         //expect(progressDiv.scope().time).toEqual(videoMidPoint.toString().toHHMMSSss());

         progressDiv.triggerHandler('click');
         scope.$apply();
         expect(API.setTapehead).toHaveBeenCalledWith(videoMidPoint);

      })
      
      it('should preserve play/paused state when clicked', function(){
         var divMidPoint = 854/2;

         API.play();
         progressDiv.scope().updateTimeDot({offsetX: divMidPoint });
         progressDiv.triggerHandler('click');
         scope.$apply();
         expect(API.state).toEqual(1);

         API.pause();
         progressDiv.scope().updateTimeDot({offsetX: divMidPoint });
         progressDiv.triggerHandler('click');
         scope.$apply();
         expect(API.state).toEqual(2);
      })

      it('its entire length should represent the time window demarcated by the start/end points', function(){
         var divMidPoint = 854/2;
         var newStartpoint = 100;
         var newEndpoint = 314;
         var videoMidPoint = newStartpoint + ((newEndpoint - newStartpoint)/2);
         spyOn(API, 'setTapehead');

         API.setStartpoint(newStartpoint);
         API.setEndpoint(newEndpoint);
         scope.$apply();

         progressDiv.scope().updateTimeDot({offsetX: divMidPoint });
         progressDiv.triggerHandler('click');
         scope.$apply();

         expect(API.setTapehead).toHaveBeenCalledWith(videoMidPoint);
      });
   });

   // TO DO:
   describe('share button', function(){});
   describe('link button', function(){});
});