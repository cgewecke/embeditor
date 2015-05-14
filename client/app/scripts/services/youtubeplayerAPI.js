var ytp_debug, ytp_debugII;
/*

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
    var updateEvent = {name: 'YTPlayerAPI:update'}; 

    // Public Variables
    self.YT;  // The YT API wrapper
    self.player;  // The YT API methods accessor
    self.video; // Current video
    self.timestamp = 0.00// Current playhead position
    self.loadState = 0.00;
    self.currentRate = 1;
    self.playbackRates = [];
    self.initializing = true;  // True as page loads, false otherwise.
    self.prevAction = 'play'; // Either 'set' or 'play', arbs tapehead location when setting.


    self.state; // Playing/Paused condition
    self.frameLength = .05;
    self.startpoint = { val: 0, display: '0:00'};
    self.endpoint = { val: 0, display: '0:00'};
    self.initialVideo = {
      duration: "6:55",
      seconds: 414, // THIS MUST BE 2 SECONDS SHORT OF THE END . . . .
      videoId: "HcXNPI-IPPM"
    };

    // METHODS: 

    // init(): Runs in the YT player ready callback on page load. Sets initial video, 
    // start/end point vals and initiates stream play. When the play event is picked up
    // by the YT event change callback, stream gets paused and player veil is removed. 
    function init(){
      var timer;
      self.initializing = true;
      self.load(self.initialVideo);

    };

    function setLoadState(timer){
      if (self.percentLoaded()){
        self.loadState = self.percentLoaded() * 100;
      }
    }

    function playbackRatesSetup(){
      
    }


    // getAPI(): Runs in the YT player ready callback - wraps the Iframe player api. 
    function getAPI(){

      // Loader
      self.load = function(video) { 
        var timer;

        self.video = video;
        self.player.loadVideoById(video.videoId);
        self.setStartpoint(0);
        self.setEndpoint(video.seconds);
        setInterval(function(){setLoadState(timer)}, 2000);
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
      // Reset prevAction flag to play
      self.prevAction = 'play';
    };

    // Start/End point setting handlers
    self.start = function(time){
      
      if (time >= self.endpoint.val - 1 ) time = self.endpoint.val - 1;

      self.pause();

      $timeout(function(){
        self.setStartpoint(time);
        self.seek(time, true);
        self.timestamp = time;
        $rootScope.$broadcast(updateEvent.name);
      });
    };

    self.end = function(time){

      if (time <= self.startpoint.val + 1 ) time = self.startpoint.val + 1;

      self.pause();

      $timeout(function(){
        self.setEndpoint(time);
        self.seek(time, true);
        self.timestamp = time;
        $rootScope.$broadcast(updateEvent.name);
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
        
        // On page load, pause opening play, make player visible, get assets 
        // that are only availabe once the player plays. 
        if (self.initializing){
          self.pause();
          self.state = 'paused';
          self.playbackRates = self.rates();
          self.initializing = false;

        } else {
           self.state = 'playing'; 
           timer = setInterval(function(){
              // Update timestamp as we play
              if (self.prevAction != 'set'){
                self.timestamp = self.time();
              }
              // Listen for end.
              if (self.timestamp >= (self.endpoint.val - .25)){
                
                if (self.prevAction === 'play'){
                  self.seek(self.startpoint.val)
                } 
                clearInterval(timer);
              }
              $rootScope.$apply();

           }, 50); 
           console.log('playing');

        }
      } else if ( event.data === BUFFERING ) {
        self.state = 'playing';
        
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

  
