var ytp_debug, ytp_debugII;
/*
BUGS:
1. CORRECT OVERSHOOT UNDERSHOOT BY PLAYBACK SPEED
2. PLAYBACK SPEED NOT SET ON LOAD FROM SEARCH
3. SETTING THE timestamp ON LOAD?
*/
(function(){
'use strict';

  angular.module('embeditor.services.youtubePlayerAPI', [])
     .service('youtubePlayerAPI', youtubePlayerAPI);

  function youtubePlayerAPI($rootScope, $timeout){

    // Private Variables
    var self = this;
    var scope = $rootScope;
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
    self.loadState = 0.00; // Fractional percentage loaded
    self.currentRate = 1; // Normal playback rate
    self.speeds = false; // Has playback rate options 
    self.initializing = true;  // True as page loads, false otherwise.
    self.setNewRate = false; // True during video load, triggers rate set when rates become avail.
    self.prevAction = 'play'; // Vals: 'set' or 'play', arbs tapehead location when setting.
    self.videoLoaded = false; // False during video load, true when the stream initiates.
    self.loop = true;

    self.state; // Vals: 'playing' or 'paused', toggles icon. 
    self.frameLength = .05;
    self.startpoint = { val: 0, display: '0:00'};
    self.endpoint = { val: 0, display: '0:00'};
    self.initialVideo = {
      duration: "6:55",
      seconds: 414, // THIS MUST BE 2 SECONDS SHORT OF THE END . . . .
      videoId: "HcXNPI-IPPM"
    };

    scope.self = self;

    // -------------------------  Private ---------------------------------------

    // init(): Runs in the YT player ready callback on page load. Sets initial video, 
    // start/end point vals and initiates stream play. When the play event is picked up
    // by the YT event change callback, stream gets paused and player veil is removed. 
    function init(){
      var timer;
      self.initializing = true;
      self.load(self.initialVideo);

    };

    // setLoadState: Assigns fractional amt loaded * 100 to loadState
    // in a setInterval.
    function setLoadState(){
      var timer;

      timer = setInterval(function(){
        if (self.percentLoaded()){
          self.loadState = self.percentLoaded() * 100;
        }
      }, 2000);
    };

    // verifyRates(): playback rates info only available once the player
    // starts playing, so this executes in the YT state change callback.
    function verifyRates(){
      (self.rates().length > 1) ? self.speeds = true: self.speeds = false;

      if (self.speeds && self.setNewRate){
        self.setRate(self.currentRate);
        self.setNewRate = false;
      }
    }

    // setStop(): an interval timer to watch for end of clip, update
    // timestamp as we play. Loop or stop when the end is reached.
    // Executes in the YT state change callback.
    function setStop(){
      var timer;
      console.log('setting stop');
      timer = setInterval(function(){

        // Update timestamp as we play, 
        //'set' handles it's own update.
        if (self.prevAction != 'set'){
          self.timestamp = self.time();
        }
        // Listen for end.
        if (self.timestamp >= (self.endpoint.val - .25)){
          
          // If we are playing, loop back to startpoint.
          if (self.prevAction === 'play'){
            self.seek(self.startpoint.val)
          } 
          clearInterval(timer);
        }
        $rootScope.$apply();

      }, 50);
    };
    
    // ---------------------------- Public: YT API Wrapper ----------------------------------
    
    // getAPI(): Runs in the YT player ready callback - wraps the Iframe player api. 
    function getAPI(){

      // Loader
      self.load = function(video) { 
        var timer;

        self.video = video;
        self.setNewRate = true;
        self.videoLoaded = false;
        self.player.loadVideoById(video.videoId);
        
        self.setStartpoint(0);
        self.setEndpoint(video.seconds);
        self.prevAction = 'play';
        setLoadState();
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
    

    // --------------- Public: Embeditor --------------------------------------------

    // Play/Pause 
    self.togglePlay = function(){

      // Pause
      if ( self.state === 'playing' ){
        self.pause();

      // Play from startpoint after setting start or end points
      } else if ( self.prevAction === 'set'){
        self.seek(self.startpoint.val);
        self.play();

      // Otherwise play from current tapehead pos after pause
      } else {
        self.play();
      }
      // Reset prevAction flag to play
      self.prevAction = 'play';
    };

    // Start/End point setting handlers
    self.start = function(time){
      
      // Don't get closer than 1 sec from endpoint, or less than 0
      if (time >= self.endpoint.val - 1 ) time = self.endpoint.val - 1;
      if (time < 0) time = 0;

      self.pause();

      $timeout(function(){
        self.setStartpoint(time);
        self.seek(time, true);
        self.timestamp = time;
        $rootScope.$broadcast(updateEvent.name);
      });
    };

    self.end = function(time){

      // Don't get closer than 1 sec from startpoint, or greater than video length
      if (time <= self.startpoint.val + 1 ) time = self.startpoint.val + 1;
      if (time > self.video.seconds) time = self.video.seconds;

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

    // replay: Convenience methods to play near or at
    // the start/endpoints 
    self.replayStart = function(){
      self.seek(self.startpoint.val);
      self.play();
      self.prevAction = 'play';
    };

    self.replayEnd = function(){
      var newTime = self.endpoint.val - 2;
      if (newTime < (self.startpoint.val + 1)) 
        newTime = self.startpoint.val + 1;

      self.seek(newTime);
      self.play();
      self.prevAction = 'play';
    }

    // YT Player Event Callbacks, registered on embedding in embeditor-youtube-player
    self.onPlayerReady = function(event){
      getAPI();
      init();
    };

    // 
    self.onPlayerStateChange = function(event){

      if (event.data === PLAYING){
        
        self.videoLoaded = true;

        // On page load, pause opening play, make player visible, get assets 
        // that are only available once the player plays. 
        if (self.initializing){
          self.pause();       
          verifyRates();
          self.initializing = false;
          
        // All other plays, including the loading play when a 
        // a search item is selected.  
        } else {
           self.state = 'playing'; 
           verifyRates();
           setStop(); 
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

  
