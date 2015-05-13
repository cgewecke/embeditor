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

  function youtubePlayerAPI($rootScope, $timeout){

    // Private Variables
    var self = this;
    var PLAYING;
    var BUFFERING;
    var PAUSED;

    // Published Events
    var initEvent = {name: 'YTPlayerAPI:init'};
    var loadEvent = {name: 'YTPlayerAPI:load'};
    var changeEvent = {name: 'YTPlayerAPI:change'}; 

    // Public Variables
    self.YT;  // The YT API wrapper
    self.player;  // The YT API methods accessor
    self.video; // Current video
    self.initializing = true;  // True as page loads, false otherwise.
    self.tapehead; // Current position of the tapehead;
    self.prevAction = 'play'; // Either 'set' or 'play', arbs tapehead location when setting.

    self.state; // Playing/Paused condition
    self.frameLength = 1/25;
    self.startpoint = { val: 0, display: '0:00'};
    self.endpoint = { val: 0, display: '0:00'};
    self.initialVideo = {
      duration: "6:56",
      seconds: 415, // THIS MUST BE A SECOND SHORT OF THE END . . . .
      videoId: "HcXNPI-IPPM"
    };

    // METHODS: 

    // init(): Runs in the YT player ready callback on page load. Sets initial video, 
    // start/end point vals and initiates stream play. When the play event is picked up
    // by the YT event change callback, stream gets paused and player veil is removed. 
    function init(){
      self.initializing = true;
      self.video = self.initialVideo;
      self.setStartpoint(0);
      self.setEndpoint(self.video.seconds);
      $rootScope.$broadcast(initEvent.name);
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
        $rootScope.$broadcast(initEvent.name)
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
      PAUSED = YT.PlayerState.PAUSED;

    }; 

    // Play/Pause 
    self.togglePlay = function(){
      // Pause
      if ( self.state === 'playing' ){
        self.pause();

      // Play after setting start/end point
      } else if ( self.prevAction === 'set'){
        self.seek(self.startpoint.val);
        self.play();

      // Play after pause
      } else {
        self.play();
      }
      // Reset prevAction flag
      self.prevAction = 'play';
    };

    // Start/End point setting handlers
    self.start = function(time){
      
      if (time >= self.endpoint.val - 1 ) time = self.endpoint.val - 1;

      self.pause();

      $timeout(function(){
        self.seek(time, true);
        self.setStartpoint(time);
        $rootScope.$broadcast(changeEvent.name);
      });
    };

    self.end = function(time){

      if (time <= self.startpoint.val + 1 ) time = self.startpoint.val + 1;

      self.pause();

      $timeout(function(){
        self.seek(time, true);
        self.setEndpoint(time);
        $rootScope.$broadcast(changeEvent.name);
      });
    };

    // Start/Endpoint setters
    self.setStartpoint = function(value){
      self.startpoint = {val: value, display: value.toString().toHHMMSSss() };
      self.prevAction = 'set';
    };

    self.setEndpoint = function(value){
      self.endpoint = {val: value, display: value.toString().toHHMMSSss() };
      self.prevAction = 'set'
    };


    // 
    self.startSeekForward = function(amount){
      
      // Increment current set point by amt.
      var time = self.startpoint.val + amount;

      // Do not pass end
      (time > self.video.seconds) ? time = self.video.seconds: time; 

      self.start(time);

      
    };
    self.startSeekRewind = function(amount){

      // Decrement current set point by amt.
      var time = self.startpoint.val - amount;

      // Do not pass 0
      (time < 0) ? time = 0: time;

      self.start(time);

    };
    // ************************************************************

    // Endpoint precision seek 
    self.endSeekForward = function(amount){
      var time = self.endpoint.val + amount;
      (time > self.video.seconds) ? time = self.video.seconds: time; 
      self.end(time);

    };
    self.endSeekRewind = function(amount){
      var time = self.endpoint.val - amount;
      (time < 0) ? time = 0: time;
      self.end(time);
    };


    // Player Event Listeners
    self.onPlayerReady = function(event){
      getAPI();
      init();
    };

    // 
    self.onPlayerStateChange = function(event){

      var timer;
      var loop = false;

      if (event.data === PLAYING){
        
        // On page load, pause opening play, make player visible, etc. 
        if (self.initializing){
          self.pause();
          self.state = 'paused';
          self.initializing = false;

        } else {
           self.state = 'playing'; 
           timer = setInterval(function(){
              if (self.time() >= self.endpoint.val){
                self.seek(self.startpoint.val);
              }
           }, 150); 
           console.log('playing');

        }
      } else if ( event.data === BUFFERING ) {
        self.state = 'playing';
        
      } else if ( event.data === PAUSED ){
        self.state = 'paused';
        clearInterval(timer);
        //if (loop){
          //loop = false;
          //self.seek(self.startpoint.val);
          //self.play();
        //}
        console.log('pausing');

      } else {
        self.state = 'paused';
      }

      $rootScope.$apply();

    };

    self.onPlayerError = function(){
      console.log('player error');

    }; 

    youtubePlayerAPI.$inject = ['$rootScope', '$timeout'];
 
  };

 })();

  
