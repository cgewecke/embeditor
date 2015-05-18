angular
  .module('yt.player.mockapi', [
  ])

   .controller('mockYTPlayerAPI', function($rootScope){

      var self = this;
      var PLAYING, BUFFERING, PAUSED;

      this.mockTime = 0.00; 
      
      this.attachMockAPI = function(service){

         // Loader
         service.load = function(video) { 
      
           service.video = video;
           service.setNewRate = true;
           service.videoLoaded = false;
           
           service.setStartpoint(0);
           service.setEndpoint(video.seconds);
           service.prevAction = 'play';
   
           //$rootScope.$broadcast(initEvent.name)
         }; 
         
         // Tape head Driver
         service.play = function() { 
           service.state = 'playing';
         };  

         service.pause = function() { 
           service.state = 'paused';
         };

         service.seek = function(location, stream) { self.mockTime = location }; 

         // Playback speed
         service.rates = function(){return [0.5, 1.0, 1.5]};
         service.getRate = function(){};
         service.setRate = function(rate){};
         
         // Player Status
         service.percentLoaded = function() {return .5};
         service.playerStatus = function(){};
         service.time = function(){ return self.mockTime };

         // Video Quality
         service.getQuality = function(){};
         service.setQuality = function(){};
         service.getLevels = function(){};
         // Duration
         service.duration = function(){};

         // Player status constants
         PLAYING = 1;
         BUFFERING = 3;
         PAUSED = 2;
      }; 
   });


   