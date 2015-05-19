var rft_debug;

describe('Component: RangeFinder', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));
  beforeEach(module('templates'));

  describe('RangeFinder', function(){

      var scope, compile, interval, timeout, playerAPI, player, rangefinder, rangeElem, YT;
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
        /*rft_debug = rangeCtrl;
        playerAPI.load(video);
        spyOn(rangeCtrl, 'init');
        rangeElem.scope().$broadcast('YTPlayerAPI:init');
        rangeElem.scope().$apply();
        expect(rangeCtrl.init).toHaveBeenCalled();
        expect(rangeCtrl.slider.options.from).toEqual(0);
        ?????????????????? SOME KIND OF SCOPE PROBLEM HERE */

      });

      it('should self-update when it hears the YTPlayerAPI:update event', function(){

      });

      describe('init()', function(){

        it('should set itself to the initial start/endpoints', function(){

        });

        it('should set proximity constraints for the handles to 1 sec from each other', function(){

        })
      })

      describe('change()', function(){

        it('should seek the video to the new value', function(){

        })
      });

      describe('finish()', function(){

        it('should set the start/end points to their new value', function(){

        });

        it('should update proximity constraints to their new values', function(){

        })
      })

  });
})