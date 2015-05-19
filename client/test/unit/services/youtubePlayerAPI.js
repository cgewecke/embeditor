var plt_debug, plt_debugII, plt_debugIII

describe('Service: youtubePlayerAPI', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('yt.player.mockapi'));

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

      }));

      describe('playerAPI.load(video)', function(){
         var video = {
            duration: "6:55",
            seconds: 414, 
            videoId: "HcXNPI-IPPM"
         };

         it('should initialize service correctly and broadcast an init event', function(){
            var serviceScope = playerAPI.scope
            spyOn(serviceScope, '$broadcast');
            playerAPI.load(video);

            expect(playerAPI.video).toEqual(video);
            expect(playerAPI.startpoint.val).toEqual(0);
            expect(playerAPI.endpoint.val).toEqual(414);
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
      });

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
            
      describe('self.loop', function(){
         
         it('should cause the player to loop when true', function(){  
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
            interval.flush(155);
            expect(playerAPI.pause).toHaveBeenCalled();
            expect(playerAPI.endpoint.val).toEqual(YT.mockTime);

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