var ytp_debug, ytp_debugII;
/*

TO DO:
1. Loading cover . . .
2. Timestamp in lower left corner over watermark
3. Time display to 0:00.00
4. Slider seeking and setting

*/
(function(){
'use strict';

  angular.module('embeditor.services.youtubePlayerAPI', [])
     .service('youtubePlayerAPI', youtubePlayerAPI);

  function youtubePlayerAPI($rootScope){

     var self = this;
     var PLAYING;
     var BUFFERING;

     self.YT;  // The YT API wrapper
     self.player;  // The YT API methods accessor
     self.video; // Current video
     self.initializing = true;  // True as page loads, false otherwise.
     self.tapehead; // Current position of the tapehead;
      
     self.state; // Playing/Paused condition
     self.frameLength = 1/25;
     self.startpoint = { raw: 0, display: '0:00'};
     self.endpoint = { raw: 0, display: '0:00'};
     self.initialVideo = {
        duration: "6:56",
        seconds: 416,
        videoId: "HcXNPI-IPPM"
     };
     
     var playerStateMessages = ['ENDED','PLAYING','PAUSED','BUFFERING','UNSTARTED','CUED'];

     // init(): Runs in the YT player ready callback on page load. Sets initial video, 
     // start/end point vals and initiates stream play. When the play event is picked up
     // by the YT event change callback, stream gets paused and player veil is removed. 
     function init(){
        self.initializing = true;
        self.video = self.initialVideo;
        self.setStartpoint(0);
        self.setEndpoint(self.player.getDuration());
        self.play();
        $rootScope.$apply();
     };

     // getAPI(): Runs in the YT player ready callback - wraps the Iframe player api. 
     function getAPI(){

        // Loader
        self.load = function(video) { 
          self.state = 'paused';
          self.video = video;
          self.player.loadVideoById(video.videoId);
          self.setStartpoint(0);
          self.setEndpoint(video.seconds);
        }; 
        
        // Tape head Driver
        self.play = function() { 
          self.state = 'playing';
          self.player.playVideo(); 
        };  

        self.pause = function() { 
          self.state = 'paused';
          self.player.pauseVideo(); 
        };
        self.seek = function(location, stream) { self.player.seekTo(location, stream) }; 

        // Playback speed
        self.rates = function(){ return self.player.getAvailablePlaybackRates() };
        self.getRate = function(){ return self.player.getPlaybackRate() };
        self.setRate = function(rate){ self.player.setPlaybackRate(rate) };
        

        // Player Status
        self.percentLoaded = function() {return self.player.getVideoLoadedFraction() };
        self.playerStatus = function(){ return self.player.getPlayerState() };
        self.time = function(){ return self.player.getCurrentTime(); };

        // Video Quality
        self.getQuality = self.player.getPlaybackQuality;
        self.setQuality = self.player.setPlaybackQuality;
        self.getLevels = self.player.getAvailableQualityLevels;

        // Duration
        self.duration = function(){ self.player.getDuration };

        // Player status contants
        PLAYING = YT.PlayerState.PLAYING;
        BUFFERING = YT.PlayerState.BUFFERING;

     }; 

     // Play/Pause click handler
     self.togglePlay = function(){
       ( self.state === 'playing' ) ? self.pause(): self.play();
     };

     // Startpoint precision seek click handlers
     self.startSeekForward = function(amount){
       var time = self.time() + amount;
       (time > self.video.seconds) ? time = self.video.seconds: time; 
       self.seek(time, true);
       self.setStartpoint(time);
       self.pause();
     };
     self.startSeekRewind = function(amount){
       var time = self.time() - amount;
       (time < 0) ? time = 0: time;
       self.seek(time, true);
       self.setStartpoint(time);
       self.pause();
     };

     // Endpoint precision seek click handlers
     self.endSeekForward = function(amount){
      self.pause();
      self.seek(self.time() + amount, false);

     };
     self.endSeekRewind = function(amount){
      self.pause();
      self.seek(self.time() - amount, false);
     };

     // Rangeslider drag events
     self.dragSeekStartpoint = function(amount){

     };

     self.dragSeekEndpoint = function(amount){

     };

     // Rangeslider set events
     self.dragSetStartpoint = function(){

     };
     self.dragSetEndpoint = function(){

     };

     // Start/Endpoint setters
     self.setStartpoint = function(value){
        self.startpoint = {raw: value, display: value.toString().toHHMMSSss() };
     };

     self.setEndpoint = function(value){
        self.endpoint = {raw: value, display: value.toString().toHHMMSSss() };
     };

     // Player Event Listeners
     self.onPlayerReady = function(event){
        getAPI();
        init();
     };

     // 
     self.onPlayerStateChange = function(event){

        if (event.data === PLAYING){
          
          // On page load, pause opening play, make player visible, etc. 
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

  
