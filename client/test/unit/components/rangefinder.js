"use strict"

var rft_debug;

describe('Component: RangeFinder', function(){

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));
  beforeEach(module('templates'));

  describe('RangeFinder', function(){

      var scope, compile, interval, timeout, playerAPI, player, ctrl, rangeCtrl, rangeElem, YT;
      var video = { seconds: 414 };

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

         rangeElem = player.find('input#embeditor-range-finder')
         rangeCtrl = player.find('embeditor-rangefinder').controller('embeditorRangefinder');

      }));

      it('should self-initialize when it hears the YTPlayerAPI:init event',function(){
  
        spyOn(rangeCtrl, 'init');
        playerAPI.load(video);
        rangeElem.scope().$broadcast('YTPlayerAPI:init');
        rangeElem.scope().$apply();
        expect(rangeCtrl.init).toHaveBeenCalledWith(playerAPI.video.seconds);
  
      });


      it('should self-update when it hears the YTPlayerAPI:update event', function(){
        spyOn(rangeCtrl, 'update');
        playerAPI.load(video);
        playerAPI.setStartpoint(10);
        playerAPI.setEndpoint(20);
        rangeElem.scope().$broadcast('YTPlayerAPI:update');
        rangeElem.scope().$apply();
        expect(rangeCtrl.update).toHaveBeenCalledWith(10,20);

      });

      describe('init()', function(){

        it('should set itself to the correct start/endpoints', function(){
          rft_debug = rangeCtrl;     
          rangeCtrl.init(video.seconds);
          rangeElem.scope().$apply();
          expect(rangeCtrl.slider.options.from).toEqual(0);
          expect(rangeCtrl.slider.options.to).toEqual(414);

        });

        it('should set proximity constraints for the handles to 1 sec from each other', function(){
          rangeCtrl.init(video.seconds);
          rangeElem.scope().$apply();
          expect(rangeCtrl.slider.options.from_max).toEqual(413);
          expect(rangeCtrl.slider.options.to_min).toEqual(1);
        })
      })

      describe('change(["newStart", "newEnd"])', function(){

        it('should seek player to the new start value when it changes', function(){
          spyOn(playerAPI, 'seek');
          playerAPI.load(video);
          playerAPI.initializing = false;
          rangeCtrl.init(video.seconds);
          rangeCtrl.change(['11', '414']);
          rangeElem.scope().$apply();
          expect(playerAPI.seek).toHaveBeenCalledWith(11);
        });

        it('should do nothing if there is no difference between new and previous values', function(){
            console.log('TEST NOT IMPLEMENTED: rangefinder finish: no diff');
        });

        it('should seek player to the new end value when it changes', function(){
          spyOn(playerAPI, 'seek');
          playerAPI.load(video);
          playerAPI.initializing = false;
          rangeCtrl.init(video.seconds);
          rangeCtrl.change(['0', '400']);
          rangeElem.scope().$apply();
          expect(playerAPI.seek).toHaveBeenCalledWith(400);
        });

        it('should pause the player on the changed frame', function(){
          spyOn(playerAPI, 'pause');
          playerAPI.load(video);
          playerAPI.initializing = false;
          rangeCtrl.init(video.seconds);
          rangeCtrl.change(['0', '400']);
          rangeElem.scope().$apply();
          expect(playerAPI.pause).toHaveBeenCalled();
        })

        it('should know which end changed, i.e work twice in a row', function(){
          spyOn(playerAPI, 'seek');
          playerAPI.load(video);
          playerAPI.initializing = false;
          rangeCtrl.init(video.seconds);
          rangeCtrl.change(['0', '400']);
          rangeElem.scope().$apply();
          expect(playerAPI.seek).toHaveBeenCalledWith(400);

          rangeCtrl.change(['100', '400']);
          rangeElem.scope().$apply();
          expect(playerAPI.seek).toHaveBeenCalledWith(100);

        })
      
      });

      describe('finish()', function(){

        it('should do nothing if there is no difference between new and previous values', function(){
          console.log('TEST NOT IMPLEMENTED: rangefinder finish: no diff');
        });

        it('should set the start/end points to their new value', function(){
          playerAPI.load(video);
          playerAPI.initializing = false;
          rangeCtrl.finish(['10', '414']);
          rangeElem.scope().$apply();
          expect(playerAPI.startpoint.val).toEqual(10);
          expect(playerAPI.endpoint.val).toEqual(414);

          rangeCtrl.finish(['10', '400']);
          rangeElem.scope().$apply();
          expect(playerAPI.startpoint.val).toEqual(10);
          expect(playerAPI.endpoint.val).toEqual(400);

        });

        it('should set the tapehead to the changed value', function(){
          spyOn(playerAPI, 'seek');
          playerAPI.load(video);
          playerAPI.initializing = false;
          rangeCtrl.finish(['10', '414']);
          rangeElem.scope().$apply();
          timeout.flush();
          expect(playerAPI.seek).toHaveBeenCalledWith(10);

          rangeCtrl.finish(['10', '400']);
          rangeElem.scope().$apply();
          timeout.flush();
          expect(playerAPI.seek).toHaveBeenCalledWith(400);
        })

        it('should update proximity constraints to their new values', function(){
          playerAPI.load(video);
          playerAPI.initializing = false;
          rangeCtrl.finish(['10', '414']);
          rangeElem.scope().$apply();
          timeout.flush();
          expect(rangeCtrl.slider.options.from_max).toEqual(413);
          expect(rangeCtrl.slider.options.to_min).toEqual(11);

          rangeCtrl.finish(['10', '400']);
          rangeElem.scope().$apply();
          timeout.flush();
          expect(rangeCtrl.slider.options.from_max).toEqual(399);
          expect(rangeCtrl.slider.options.to_min).toEqual(11);

        })
      })

  });
})