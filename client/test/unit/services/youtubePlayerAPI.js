var plt_debug, plt_debugII, plt_debugIII

describe('Component: playercontrols & Service: youtubePlayerAPI', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));
  beforeEach(module('templates'));

  describe('Player Controls', function(){

      var scope, compile, interval, timeout, playerAPI, player, YT;
      var PLAYING = 1;
      var BUFFERING = 3;
      var PAUSED = 2;
      
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
            
            playerAPI.state = 'paused';
            scope.$apply();
            playBtn.triggerHandler('click');
            scope.$apply();
            
            expect(playerAPI.play).toHaveBeenCalled();
            expect(playIcon.hasClass('ng-hide')).toBe(false);
            expect(pauseIcon.hasClass('ng-hide')).toBe(true);

         });

         it('should pause the video if the video is playing and display a play icon', function(){
            spyOn(playerAPI, 'pause');

            playerAPI.state = 'playing';
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
            expect(slider.isolateScope().modelValue).toBe(.5);

            playerAPI.currentRate = 1.5;
            scope.$apply();
            expect(slider.isolateScope().modelValue).toBe(1.5);
   
         });

         
         it('should change the playback speed when the model is changed', function(){
            playerAPI.videoLoaded = true;
            spyOn(playerAPI, 'setRate');

            playerAPI.currentRate = 0.5;
            scope.$apply();
            expect(playerAPI.setRate).toHaveBeenCalledWith(.5);
            
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

         it('should cause the player to loop when on', function(){  
            spyOn(playerAPI, 'seek');

            // Simulate load. 
            playerAPI.initializing = false;    
            playerAPI.loop = true;

            playerAPI.setStartpoint(5);
            playerAPI.setEndpoint(10);
            playerAPI.togglePlay();
            playerAPI.onPlayerStateChange({data: PLAYING}); // Simulate player event 'playing'
            YT.mockTime = 10; // Set time to end
            interval.flush(55); // Run time listener in setStop()
            expect(playerAPI.seek).toHaveBeenCalledWith(5);
         });

         it('should cause the player to stop playing at the endpoint when off', function(){

            spyOn(playerAPI, 'pause');

            // Simulate loaded state. 
            playerAPI.initializing = false;    
            playerAPI.loop = false;

            playerAPI.setStartpoint(5);
            playerAPI.setEndpoint(10);
            playerAPI.togglePlay();
            playerAPI.onPlayerStateChange({data: PLAYING}); // Simulate player event . . .
            YT.mockTime = 10;
            interval.flush(55);
            expect(playerAPI.pause).toHaveBeenCalled();
            expect(playerAPI.endpoint.val).toEqual(YT.mockTime);

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

      describe('playerAPI.start(amount)', function(){
         var video = {
            duration: "6:55",
            seconds: 414, 
            videoId: "HcXNPI-IPPM"
         };

         beforeEach(function(){
            playerAPI.load(video);
         })
         it('should seek to current startpoint +/- "amount"', function(){
            spyOn(playerAPI, 'seek');
            playerAPI.start(5);
            timeout.flush();
            expect(playerAPI.seek).toHaveBeenCalledWith(5);
            playerAPI.start(-2);
            timeout.flush();
            expect(playerAPI.seek).toHaveBeenCalledWith(3);
            
         });

         it('should pause the player', function(){
            spyOn(playerAPI, 'pause');
            playerAPI.togglePlay();
            expect(playerAPI.state).toEqual('playing');
            playerAPI.start(5);
            expect(playerAPI.pause).toHaveBeenCalled();

         })

         it('should set the startpoint to new tapehead position', function(){
            expect(playerAPI.startpoint.val).toEqual(0);
            playerAPI.start(5);
            timeout.flush();
            expect(playerAPI.startpoint.val).toEqual(5);
         })

         it('should not allow the startpoint to be set nearer than one second away from the endpoint', function(){
            playerAPI.setStartpoint(5);
            playerAPI.setEndpoint(10);
            playerAPI.start(5);
            timeout.flush();
            expect(playerAPI.startpoint.val).toEqual(9);

         })

         it('should not allow the startpoint to be set before 0.00', function(){
            playerAPI.setStartpoint(5);
            playerAPI.start(-6);
            timeout.flush();
            expect(playerAPI.startpoint.val).toEqual(0);

         });

         it('should  broadcast an update event', function(){
            var serviceScope = playerAPI.scope;
            spyOn(serviceScope, '$broadcast');
            playerAPI.start(5);
            timeout.flush();
            expect(serviceScope.$broadcast).toHaveBeenCalledWith('YTPlayerAPI:update');
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

         it('should wire the buttons correctly', function(){
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

      describe('playerAPI.end(amount)', function(){
         var video = {
            duration: "6:55",
            seconds: 414, 
            videoId: "HcXNPI-IPPM"
         };

         beforeEach(function(){
            playerAPI.load(video);
         })
         it('should seek to current endpoint +/- "amount"', function(){
            spyOn(playerAPI, 'seek');
            playerAPI.end(-4);
            timeout.flush();
            expect(playerAPI.seek).toHaveBeenCalledWith(410);
            playerAPI.end(2);
            timeout.flush();
            expect(playerAPI.seek).toHaveBeenCalledWith(412);
            
         });

         it('should pause the player', function(){
            spyOn(playerAPI, 'pause');
            playerAPI.togglePlay();
            expect(playerAPI.state).toEqual('playing');
            playerAPI.end(-5);
            expect(playerAPI.pause).toHaveBeenCalled();

         })

         it('should set the startpoint to new tapehead position', function(){
            expect(playerAPI.endpoint.val).toEqual(414);
            playerAPI.end(-14);
            timeout.flush();
            expect(playerAPI.endpoint.val).toEqual(400);
         })

         it('should not allow the endpoint to be set nearer than one second away from the startpoint', function(){
            playerAPI.setStartpoint(410);
            playerAPI.end(-5);
            timeout.flush();
            expect(playerAPI.endpoint.val).toEqual(411);

         })

         it('should not allow the endpoint to be set past video end', function(){
            playerAPI.setEndpoint(410);
            playerAPI.end(5);
            timeout.flush();
            expect(playerAPI.endpoint.val).toEqual(414);

         });

         it('should  broadcast an update event', function(){
            var serviceScope = playerAPI.scope;
            spyOn(serviceScope, '$broadcast');
            playerAPI.end(-5);
            timeout.flush();
            expect(serviceScope.$broadcast).toHaveBeenCalledWith('YTPlayerAPI:update');
         })
      })

      describe('playerAPI: replayStart()', function(){

         it('should seek to the startpoint and play', function(){
            spyOn(playerAPI, 'seek');
            spyOn(playerAPI, 'play');

            playerAPI.setStartpoint(10);
            mockTime = 20;
            playerAPI.replayStart();

            expect(playerAPI.seek).toHaveBeenCalledWith(10);
            expect(playerAPI.play).toHaveBeenCalled();

         });
      });

      describe('playerAPI: replayEnd()', function(){

         it('should seek to 2 seconds before the endpoint and play from there', function(){
            spyOn(playerAPI, 'seek');
            spyOn(playerAPI, 'play');

            playerAPI.setEndpoint(10);
            playerAPI.replayEnd();
            expect(playerAPI.seek).toHaveBeenCalledWith(8);
            expect(playerAPI.play).toHaveBeenCalled();

         });

         it('should not seek to before the startpoint', function(){
            spyOn(playerAPI, 'seek');
            spyOn(playerAPI, 'play');

            playerAPI.setStartpoint(9);
            playerAPI.setEndpoint(10);
            playerAPI.replayEnd();
            expect(playerAPI.seek).toHaveBeenCalledWith(9);
            expect(playerAPI.play).toHaveBeenCalled();

         });
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


      /*
      // HOW TO HANDLE SKIP PLAY
      describe('Start/End points slider/setter', function(){

         it('should set the value of the endpoints when its handles are dragged', function(){

         });

         it('should show the appropriate keyframes in the view as the handles are dragged', function(){

         });

         it('should always maintain a minimum distance of 1 second between endpoints', function(){

         });

      });*/

      

  })

});