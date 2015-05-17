var plt_debug, plt_debugII, plt_debugIII

describe('Component: playercontrols & Service: youtubePlayerAPI', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));
  beforeEach(module('templates'));

  describe('Player Controls', function(){

      var scope, compile, playerAPI, player, YT;
      
      beforeEach(inject(function ($controller, $rootScope, $compile, _youtubePlayerAPI_ ) {

         scope = $rootScope.$new();
         compile = $compile;
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

      describe('Play button', function(){
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
         it('should be bound to the value of playerAPI.currentRate', function(){
            playerAPI.currentRate = .5;
            scope.$apply();
            expect(slider.isolateScope().modelValue).toBe(.5);

            playerAPI.currentRate = 1.5;
            scope.$apply();
            expect(slider.isolateScope().modelValue).toBe(1.5);
   
         });

         it('should have a default value of 1', function(){
            expect(slider.isolateScope().modelValue).toBe(1);
            
         })
         it('should change the playback speed when the model is changed', function(){
            playerAPI.videoLoaded = true;
            spyOn(playerAPI, 'setRate');

            playerAPI.currentRate = 0.5;
            scope.$apply();
            expect(playerAPI.setRate).toHaveBeenCalledWith(.5);
            
         })

         it('should be disabled if there are no playback speed options', function(){
                     
         });

         it('should have a tooltip that explains why it is disabled', function(){
            
         });
      });

      describe('Loop toggle', function(){
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

            
         });

         it('should cause the player to loop when on', function(){

            
         });

         it('should cause the player to stop playing at the endpoint when off', function(){

            
         });

      })
      /*
      describe('Advanced Options menu', function(){
         it('should show all the iframe parameters and allow the user to set them', function(){

         });
      })

      // Start point controls 
      describe('startpoint display', function(){
         it('should show the current value of the startpoint', function(){

         });
      })


      describe('Seek frame button forward: startpoint', function(){

         it('should advance the playhead one frame, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the endpoint', function(){

         })

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });
         

      })

      describe('Seek second button forward: startpoint', function(){

         it('should advance the playhead one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the endpoint', function(){

         })

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button forward: startpoint', function(){

         it('should advance the playhead 5 seconds, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than 5 seconds away from the endpoint', function(){

         })

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      });

      describe('Seek frame button backward: startpoint ', function(){

         it('should set the playhead back one frame, and pause the player', function(){

         });

         it('should be disabled if the playhead is at video start', function(){

         })

         it('should not allow the playhead to be set before video start', function(){

         });

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      });

      describe('Seek second button backward: startpoint', function(){

         it('should set the playhead back one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is at video start', function(){

         })

         it('should not allow the playhead to be set before video start', function(){

         });

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button backward: startpoint', function(){

         it('should set the playhead back one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is at video start', function(){

         })

         it('should not allow the playhead to be set before video start', function(){

         });

         it('should set the startpoint at the playhead position', function(){

         })

         it('should synch the sliders left handle to the new startpoint value', function(){

         });


      });

      // End point controls 
      describe('Seek frame button forward: endpoint', function(){

         it('should move the playhead to the endpoint + 1 frame and pause the player', function(){

         });

         it('should be disabled if the playhead is at video end', function(){

         })

         it('should not allow the playhead to be set past video end', function(){

         });


         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new endpoint value', function(){

         });
         

      })

      describe('Seek second button forward: startpoint', function(){

         
         it('should move the playhead to the endpoint + 1 second and pause the player', function(){

         });

         it('should be disabled if the playhead is at video end', function(){

         })

         it('should not allow the playhead to be set past video end', function(){

         });

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button forward: startpoint', function(){

         it('should move the playhead to the endpoint + 5 seconds and pause the player', function(){

         });

         it('should be disabled if the playhead is at video end', function(){

         })

         it('should not allow the playhead to be set past video end', function(){

         });

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });

      });

      describe('Seek frame button backward: startpoint ', function(){

         it('should set the playhead back one frame, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the startpoint', function(){

         })

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });
         
      });

      describe('Seek second button backward: startpoint', function(){

         it('should set the playhead back one second, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the startpoint', function(){

         })

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });

      })

      describe('Seek 5 second button backward: startpoint', function(){

         it('should set the playhead back 5 seconds, and pause the player', function(){

         });

         it('should be disabled if the playhead is less than one second away from the startpoint', function(){

         })

         it('should set the endpoint at the new playhead position', function(){

         })

         it('should synch the sliders right handle to the new startpoint value', function(){

         });


      });

      describe('endpoint display', function(){
         it('should show the current value of the endpoint', function(){

         });
      })

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