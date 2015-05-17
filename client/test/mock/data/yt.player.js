angular
  .module('yt.player.mockapi', [
  ])

   .controller('mockYTPlayerAPI', function(){

      var self = this;

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
           setLoadState();
           $rootScope.$broadcast(initEvent.name)
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
         service.rates = function(){};
         service.getRate = function(){};
         service.setRate = function(rate){};
         
         // Player Status
         service.percentLoaded = function() {};
         service.playerStatus = function(){};
         service.time = function(){ return self.mockTime };

         // Video Quality
         service.getQuality = function(){};
         service.setQuality = function(){};
         service.getLevels = function(){};
         // Duration
         service.duration = function(){};

         // Player status contants
         //PLAYING = YT.PlayerState.PLAYING;
         //BUFFERING = YT.PlayerState.BUFFERING;
         //PAUSED = YT.PlayerState.PAUSED;
      }; 
   });


   