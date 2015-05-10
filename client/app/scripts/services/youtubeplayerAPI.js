var ytp_debug, ytp_debugII;

(function(){
'use strict';

  angular.module('embeditor.services.youtubePlayerAPI', [])
     .service('youtubePlayerAPI', youtubePlayerAPI);

  function youtubePlayerAPI($rootScope){

     var self = this;
     var PLAYING;
     var BUFFERING;

     self.player;
     self.initializing;
     self.YT;
     self.state;
     self.stream;
     self.frameLength = 1/25;
     self.startpoint = { raw: 0, display: '0:00'};
     self.endpoint = { raw: 0, display: '0:00'};
     self.initialVideoId = "HcXNPI-IPPM"; // Die Antwoord, Baby's on Fire
     self.altVideoId = "6XYzbW3bZOQ"; // Miles Davis Live in Stockholm 1972
  
     var playerStateMessages = ['ENDED','PLAYING','PAUSED','BUFFERING','UNSTARTED','CUED'];

    
     function init(){
        self.initializing = true;
        self.setStartpoint(0);
        self.setEndpoint(self.player.getDuration());
        self.play();
        $rootScope.$apply();
     };

     function getAPI(){

        // Driver
        self.load = function(video) { 
          self.state = 'paused';
          self.player.loadVideoById(video.videoId);
          self.setStartpoint(0);
          self.setEndpoint(video.seconds);
        }; 
        self.cue = function(videoId){ 
          self.state = 'paused';
          self.player.cueVideoById(videoId); 
          init();
        }; 

        self.play = function() { 
          self.state = 'playing';
          self.player.playVideo(); 
        };  

        self.pause = function() { 
          self.state = 'paused';
          self.player.pauseVideo(); 
        };
  
        self.seek = function(start) { self.player.seekTo(start) }; 

        // Playback
        self.getRate = self.player.getPlaybackRate;
        self.setRate = self.player.setPlaybackRate;
        self.rates = self.player.getAvailablePlaybackRates;

        // Status
        self.loaded = function() {return self.player.getVideoLoadedFraction() };
        self.state = function(){ return self.player.getPlayerState() };
        self.time = function(){ return self.player.getCurrentTime(); };

        // Video Quality
        self.getQuality = self.player.getPlaybackQuality;
        self.setQuality = self.player.setPlaybackQuality;
        self.getLevels = self.player.getAvailableQualityLevels;

        // Duration
        self.duration = function(){ self.player.getDuration };

        PLAYING = YT.PlayerState.PLAYING;
        BUFFERING = YT.PlayerState.BUFFERING;

     }; 

     self.togglePlay = function(){
       ( self.state === 'playing' ) ? self.pause(): self.play();
     };

     self.startSeekForward = function(amount){
       var time = self.time() + amount;
       self.seek(time, false);
       self.setStartpoint(time);
       self.pause();
     };
     self.startSeekRewind = function(amount){
       var time = self.time() - amount;
       self.seek(time, false);
       self.setStartpoint(time);
       self.pause();
     };
     self.endSeekForward = function(amount){
      self.pause();
      self.seek(self.time() + amount, true);

     };
     self.endSeekRewind = function(amount){
      self.pause();
      self.seek(self.time() - amount, true);
     };

     self.setStartpoint = function(value){
        self.startpoint = {raw: value, display: value.toString().toHHMMSS() };
     };

     self.setEndpoint = function(value){
        self.endpoint = {raw: value, display: value.toString().toHHMMSS() };
     };

     // Player Event Listeners
     self.onPlayerReady = function(event){
        getAPI();
        init();
     };

     self.onPlayerStateChange = function(event){

        if (event.data === PLAYING){
          
          if (self.initializing){
            self.pause();
            self.state = 'paused';
            self.initializing = false;

          } else {
             self.state = 'playing';  
          }
        } else if ( event.data === BUFFERING ) {
          self.state = 'playing';
        } else {
          self.state = 'paused';
        }

        $rootScope.$apply();

     };

     self.onPlayerError = function(){

     }; 

     youtubePlayerAPI.$inject = ['$rootScope'];
 
  };

 })();

  
