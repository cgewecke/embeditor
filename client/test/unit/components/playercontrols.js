"use strict"

var plt_debug, plt_debugII, plt_debugIII;

describe('Component: PlayerControls', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));
  beforeEach(module('templates'));

  describe('Player Controls', function(){

      var scope, compile, interval, timeout, playerAPI, player, ctrl, YT;
      
      beforeEach(inject(function ($controller, $rootScope, $compile, $interval, $timeout, _youtubePlayerAPI_ ) {

         scope = $rootScope.$new();
         compile = $compile;
         interval = $interval;
         timeout = $timeout;
         playerAPI = _youtubePlayerAPI_;

         ctrl = $controller('PlayerCtrl', {$scope: scope });
         YT = $controller("mockYTPlayerAPI", {$scope: scope });

         YT.attachMockAPI(playerAPI);

         player = angular.element('<embeditor-section-player-controls></embeditor-section-player-controls>');
         compile(player)(scope);
         scope.$digest();
      }));

      it('should disable controls until the player has loaded the video',function(){

      });

      describe('playerAPI.togglePlay()/Play button', function(){
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

      describe('Playback speed setter', function(){
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

         it('should have a tooltip that explains why it is disabled', function(){
            
         });
      });

      describe('Loop toggle', function(){
         var loopswitch, ngModel;
         beforeEach(function(){
            loopswitch = player.find('md-switch#loop-switch');
         });

         it('should be on by default', function(){
            ngModel = loopswitch.controller('ngModel');
            expect(ngModel.$modelValue).toBe(true);
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

      })
      /*
      describe('Advanced Options menu', function(){
         it('should show all the iframe parameters and allow the user to set them', function(){

         });
      })

      */

      describe('Startpoint precision seek button block', function(){
         var back5, back1, backFrame, forward5, forward1, forwardFrame;
         beforeEach(function(){
            back5 = player.find('button#start-back-5sec-btn');
            back1 = player.find('button#start-back-1sec-btn');
            backFrame = player.find('button#start-back-frame-btn');
            forwardFrame = player.find('button#start-fwd-frame-btn');
            forward1 = player.find('button#start-fwd-1sec-btn');
            forward5 = player.find('button#start-fwd-5sec-btn')

         })
         it('should have six buttons', function(){
            expect(back5.length).toBe(1);
            expect(back1.length).toBe(1);
            expect(backFrame.length).toBe(1);
            expect(forward1.length).toBe(1);
            expect(forwardFrame.length).toBe(1);
            expect(forward5.length).toBe(1);
         });

         it('should wire the buttons correctly', function(){
            spyOn(playerAPI, 'start');
            
            back5.triggerHandler('click');
            expect(playerAPI.start).toHaveBeenCalledWith(-5);

            back1.triggerHandler('click');
            expect(playerAPI.start).toHaveBeenCalledWith(-1);

            backFrame.triggerHandler('click');
            expect(playerAPI.start).toHaveBeenCalledWith(-(playerAPI.frameLength));

            forward5.triggerHandler('click');
            expect(playerAPI.start).toHaveBeenCalledWith(5);

            forward1.triggerHandler('click');
            expect(playerAPI.start).toHaveBeenCalledWith(1);

            forwardFrame.triggerHandler('click');
            expect(playerAPI.start).toHaveBeenCalledWith(playerAPI.frameLength);

         })
      })

      describe('Endpoint precision seek button block', function(){
         var back5, back1, backFrame, forward5, forward1, forwardFrame;
         var video = {
            duration: "6:55",
            seconds: 414, 
            videoId: "HcXNPI-IPPM"
         };
         beforeEach(function(){
            back5 = player.find('button#end-back-5sec-btn');
            back1 = player.find('button#end-back-1sec-btn');
            backFrame = player.find('button#end-back-frame-btn');
            forwardFrame = player.find('button#end-fwd-frame-btn');
            forward1 = player.find('button#end-fwd-1sec-btn');
            forward5 = player.find('button#end-fwd-5sec-btn')
            playerAPI.load(video);
         })
         it('should have six buttons', function(){
            expect(back5.length).toBe(1);
            expect(back1.length).toBe(1);
            expect(backFrame.length).toBe(1);
            expect(forward1.length).toBe(1);
            expect(forwardFrame.length).toBe(1);
            expect(forward5.length).toBe(1);
         });

         it('should wire the buttons to the playerAPI correctly', function(){
            spyOn(playerAPI, 'end');
            
            back5.triggerHandler('click');
            expect(playerAPI.end).toHaveBeenCalledWith(-5);

            back1.triggerHandler('click');
            expect(playerAPI.end).toHaveBeenCalledWith(-1);

            backFrame.triggerHandler('click');
            expect(playerAPI.end).toHaveBeenCalledWith(-(playerAPI.frameLength));

            forward5.triggerHandler('click');
            expect(playerAPI.end).toHaveBeenCalledWith(5);

            forward1.triggerHandler('click');
            expect(playerAPI.end).toHaveBeenCalledWith(1);

            forwardFrame.triggerHandler('click');
            expect(playerAPI.end).toHaveBeenCalledWith(playerAPI.frameLength);

         })
      })

            
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

      // Start point controls 
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

      describe('progress bar', function(){
         var progress, API, progressDiv;

         var video = {
            duration: "6:55",
            seconds: 414, 
            videoId: "HcXNPI-IPPM"
         };

         beforeEach( function(){
            progress = angular.element('<embeditor-player-time-bar></embeditor-player-time-bar>');
            compile(progress)(scope);
            scope.$digest();
            API = progress.scope().API;
            API.load(video);
            progressDiv = progress.find('div#time-bar');
         });

         it('should be wired correctly', function(){
            expect(progressDiv.attr('ng-mousemove')).toEqual('updateTimeDot($event)');
            expect(progressDiv.attr('ng-mouseleave')).toEqual('hideTimeDot()');
            expect(progressDiv.attr('ng-click')).toEqual('seekVideoToTimeDot()');
         })

         it('should correctly translate the x position of the click to time position in the video', function(){

            var divMidPoint = 854/2;
            var videoMidPoint = 414/2;

            spyOn(API, 'seek');
            progressDiv.scope().updateTimeDot({offsetX: divMidPoint });

            expect(progressDiv.scope().time).toEqual(videoMidPoint.toString().toHHMMSSss());

            progressDiv.triggerHandler('click');
            scope.$apply();
            expect(API.seek).toHaveBeenCalledWith(videoMidPoint);

         })
         

         it('should preserve play/paused state when clicked', function(){
            var divMidPoint = 854/2;
   
            API.play();
            progressDiv.scope().updateTimeDot({offsetX: divMidPoint });
            progressDiv.triggerHandler('click');
            scope.$apply();
            expect(API.state).toEqual('playing');

            API.pause();
            progressDiv.scope().updateTimeDot({offsetX: divMidPoint });
            progressDiv.triggerHandler('click');
            scope.$apply();
            expect(API.state).toEqual('paused');
         })

         it('its entire length should represent the time window demarcated by the start/end points', function(){
            var divMidPoint = 854/2;
            var videoMidPoint = ((314-100)/2) + 100;
            spyOn(API, 'seek');

            API.setStartpoint(100);
            API.setEndpoint(314);
            scope.$apply();

            progressDiv.scope().updateTimeDot({offsetX: divMidPoint });
            progressDiv.triggerHandler('click');
            scope.$apply();

            expect(API.seek).toHaveBeenCalledWith(videoMidPoint);
         });
      })

  })

});