var ytp_debug, ytp_debugII;
/*
BUGS:
1. CORRECT OVERSHOOT UNDERSHOOT BY PLAYBACK SPEED (??)
*/
(function(){
'use strict';

  angular.module('embeditor.services.youtubePlayerAPI', [])
     .service('youtubePlayerAPI', youtubePlayerAPI);

  function youtubePlayerAPI($rootScope, $timeout, $interval ){

    // Private Variables
    var self = this;
    var scope = $rootScope;
    var timeout = null; // $timeout promise - cancelled at killStop()
    var interval = null; // $interval promise - cancelled at killStop()
    //var kill = false; // True in killStop(), false in setStop() $timeout;
    var PLAYING = 1, PAUSED = 2, BUFFERING = 3;
  
    // Published Events
    var initEvent = {name: 'YTPlayerAPI:init'}; // Cast on video load
    var loadEvent = {name: 'YTPlayerAPI:load'};
    var updateEvent = {name: 'YTPlayerAPI:update'};  // Cast when tapehead is reset to start/endpoint
    var setEvent = {name: 'YTPlayerAPI:set'}; // Cast when start/endpoints vals change

    // Public Variables   
    self.YT;  // The YT API wrapper
    self.player;  // The YT API methods accessor
    self.video; // Current video
    self.timestamp = 0.00// Current playhead position
    self.loadState = 0.00; // Fractional percentage loaded
    self.percentPlayed = 0.00; // Location of tapehead as percentage of current time window
    self.currentRate = 1; // Normal playback rate
    self.speeds = false; // Has playback rate options 
    self.initializing = true;  // True as page loads, false otherwise.
    self.setNewRate = false; // True during video load, triggers rate set when rates become avail.
    self.prevAction = 'play'; // Vals: 'set' or 'play', arbs tapehead location when setting.
    self.videoLoaded = false; // False during video load, true when the stream initiates.
    self.minLengthWarning = false; // True when start/endpoints are 1 sec apart, false otherwise.
    self.loop = true; // When true, player loops back to startpoint from endpoint
    self.mute = false; // When true, player is muted. 
    self.autoplay = false; // When true, embed will auto-play on iframe load
    
    self.state; // Vals: 'playing' or 'paused', toggles icon. 
    self.frameLength = .05;
    self.startpoint = { val: 0, display: '0:00'};
    self.endpoint = { val: 0, display: '0:00'};
    self.initialVideo = {
      // Baby's On Fire: Die Antwoord
      //seconds: 414, // THIS MUST BE 2 SECONDS SHORT OF THE END . . . .
      //videoId: "HcXNPI-IPPM"

      // Cafe scene from Le feu follet
      seconds: 144,
      videoId: 'IwSQxlwMzr8'
    };

    

    self.scope = $rootScope; // TESTING . . .
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
    // in a setInterval. destroy old timers!!!!!
    function setLoadState(){
      var timer, offset;

      timer = $interval(function(){
        // Load Progress
        if (self.percentLoaded()){
          self.loadState = self.percentLoaded() * 100;
        }
        // Play Progress
        //self.percentPlayed = 0.00;
        if (self.video){
          if ((self.endpoint.val - self.startpoint.val) < 60){
            self.percentPlayed = 100;
          } else {
            offset = self.timestamp - self.startpoint.val;
            self.percentPlayed = (offset/(self.endpoint.val - self.startpoint.val)) * 100.00;
            if (self.percentPlayed < 0) self.percentPlayed = 0;
          }
        }
      }, 1000);
    };

    // verifyRates(): playback rates info only available once the player
    // starts playing, so this executes in the YT state change callback.
    // Rate setting carries over from video to video.
    function verifyRates(){

      (self.rates().length > 1) ? self.speeds = true: self.speeds = false;

      if (self.speeds && self.setNewRate){
        self.setRate(self.currentRate);
        self.setNewRate = false;
      }
    }

    /*--------------------------- TIMERS --------------------------------------*/
    // setStop(): an interval timer to update the timestamp, and a
    //            timeout for the end of the clip, Loops or stop at endpoint.
    // killStop(): cancels timers
    //  
    // setStop() is called: 
    //  1. on non-initial-load changes to 'playing' state in onPlayerStateChange().
    //     (this happens on each loop)
    //  2. 'continuing play' condition in reset(), when the start/endpoints are reset
    //
    // killStop is called:
    // 1. in setStop() when the $timeout function executes
    // 2. in setRates(), because the duration needs to change
    // 3. in reset() in the 'continue play' condition, before setStop()
    //    because old starts/stops must be abandoned.

    // setStop()
    function setStop(){
    
      var ms = timeoutLength();
      killStop();
      
      // Update timestamp as we play.
      interval = $interval(function(){
        
        var time = self.time();
        (self.prevAction != 'set') ? self.timestamp = time : false;

      }, 150);

       // If we are playing & looping, loop back to startpoint.
      timeout = $timeout(function(){
          
          if (!self.loop){
            self.pause();
          } else if (self.prevAction === 'play'){
            self.seek(self.startpoint.val);
          } 
          killStop(); 

      }, ms );
    };
    
    // killStop(): 
    function killStop(){
      
      $interval.cancel(interval);
      $timeout.cancel(timeout);

    }

    // timeoutLength() - returns duration for $timeout, calibrated to playback rate
    function timeoutLength(){

      var ms = Math.floor( (self.endpoint.val - self.time()) * 1000 );

      if (self.currentRate == 0.5) return (ms * 2);
      if (self.currentRate == 1 ) return (ms);
      if (self.currentRate == 1.5) return Math.floor(ms * .66);
      
      return ms;
    }
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
        
        $rootScope.$broadcast(initEvent.name);
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
      self.setRate = function(rate){ 
        self.player.setPlaybackRate(rate);
        killStop();
        (self.state === 'playing') ? setStop() : false;
      };
      
      // Mute/Unmute 
      self.silence = function(){ self.player.mute() };
      self.noise = function(){ self.player.unMute() };

      // Player Status
      self.percentLoaded = function() {return self.player.getVideoLoadedFraction() };
      self.playerStatus = function(){ return self.player.getPlayerState() };
      self.time = function(){ return self.player.getCurrentTime(); };

      // Video Quality
      self.getQuality = self.player.getPlaybackQuality;
      self.setQuality = self.player.setPlaybackQuality;
      self.getLevels = self.player.getAvailableQualityLevels;

      // Duration
      self.duration = function(){ return self.player.getDuration() };

      // Player status contants
      PLAYING = YT.PlayerState.PLAYING;
      BUFFERING = YT.PlayerState.BUFFERING;
      PAUSED = YT.PlayerState.PAUSED;

    }; 
    

    // --------------- Public: Embeditor --------------------------------------------

    // Play/Pause 
    self.togglePlay = function(){

      var time;
      // Pause
      if ( self.state === 'playing' ){
        self.pause();

      // Play from startpoint after setting start or end points
      } else if ( self.prevAction === 'set'){
        self.seek(self.startpoint.val);
        self.play();

      // Otherwise play after pause:
      // from: start if tapehead at end, or 
      // from: tapehead otherwise
      } else {
        if ((self.time() + .25) > self.endpoint.val){
          self.seek(self.startpoint.val);
          self.play();
        } else {
          self.play();
        }
      }
      // Reset prevAction flag to play
      self.prevAction = 'play';
    };

    // Start/End point setting handlers
    self.start = function(change){
     
      var time = self.startpoint.val + change;
      // Don't get closer than 1 sec from endpoint, or less than 0
      if (time >= self.endpoint.val - 1 ){
         time = self.endpoint.val - 1;
         self.minLengthWarning = true;
      } else {
        self.minLengthWarning = false;
      }
      if (time < 0) time = 0;

      self.pause();

      $timeout(function(){
        self.setStartpoint(time);
        self.seek(time);
        self.timestamp = time;
        $rootScope.$broadcast(updateEvent.name);
      });
    };

    self.end = function(change){
     
      var time = self.endpoint.val + change;
      
      // Don't get closer than 1 sec from startpoint, or greater than video length
      if (time <= self.startpoint.val + 1 ){
        time = self.startpoint.val + 1;
        self.minLengthWarning = true;
      } else {
        self.minLengthWarning = false;
      }

      if (time > self.video.seconds) time = self.video.seconds;

      self.pause();

      $timeout(function(){
        self.setEndpoint(time);
        self.seek(time);
        self.timestamp = time;
        $rootScope.$broadcast(updateEvent.name);
      });
    };

    // Start/Endpoint setters
    self.setStartpoint = function(value){
      self.startpoint = {val: value, display: value.toString().toHHMMSSss() };
      self.prevAction = 'set';
      $rootScope.$broadcast(setEvent.name, {type: 'start', value: value });
    };

    self.setEndpoint = function(value){
      self.endpoint = {val: value, display: value.toString().toHHMMSSss() };
      self.prevAction = 'set';
      $rootScope.$broadcast(setEvent.name, {type: 'end', value: value });
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
        newTime = self.startpoint.val;

      self.seek(newTime);
      self.play();
      self.prevAction = 'play';
    }

    // reset() resets the start/stop back to video min/max
    self.reset = function(){

      // Start
      self.setStartpoint(0);
      $rootScope.$broadcast(updateEvent.name);
      // End
      self.setEndpoint(self.video.seconds);
      $rootScope.$broadcast(updateEvent.name);

      // Keep state: play -> continue playing: paused -> do nothing.
      // Reset timers
      if (self.state === 'playing'){
        self.prevAction = 'play';
        killStop();
        setStop();
      } else {
        killStop();
      }
    }

    // setTapehead the tapehead & timestamp to value. Behaviorally equivalent to
    // play 
    self.setTapehead = function(time){

      (self.state !== 'playing') ? self.timestamp = time : false;

      self.prevAction = 'play';
      self.seek(time);
    };

    // YT Player Event Callbacks, registered on embedding in embeditor-youtube-player
    self.onPlayerReady = function(event){
      getAPI();
      init();
    };

    // 
    self.onPlayerStateChange = function(event){
    
      if (event.data === PLAYING){
        self.videoLoaded = true; // Rate & Quality assets now available

        // On page load, pause opening play, make player visible,
        // Get playback rates 
        if (self.initializing){
          self.pause();  
          self.end(-8);
          self.start(32);     
          verifyRates();
          $timeout(function(){ self.initializing = false; }, 500);
          
        // All other plays, including the loading play when a 
        // a search item is selected.  
        } else {
           self.state = 'playing'; 
           verifyRates();
           setStop();        
        }
      } else if ( event.data === BUFFERING ) {
    
        self.state = 'playing';
        killStop();
        
      } else {
    
        self.state = 'paused';
        killStop();
      }
      $rootScope.$apply();
    };

    self.onPlayerError = function(){
      console.log('player error');

    }; 

    youtubePlayerAPI.$inject = ['$rootScope', '$timeout', '$interval'];
 
  };

 })();

 /*
 // setStop(): an interval timer to update the timestamp, and a
    // timeout for the end of the clip, Loop or stop when the end is reached.
    // Called in the YT state change callback, which executes after every
    // seek.
    function setStop(){
      
      var timer;
      var offset = 0.250;
    
      timer = $interval(function(){
        
        var time = self.time();

        // Update timestamp as we play, 
        //'set' handles it's own update.
        if (self.prevAction != 'set'){
          self.timestamp = time;
        }
        // Listen for end.
        if (time >= (self.endpoint.val - offset)){

          // If we are playing & looping, loop back to startpoint.
          if (!self.loop){
            self.pause();
          } else if (self.prevAction === 'play'){
            self.seek(self.startpoint.val);
          } 
          $interval.cancel(timer);
        }

      }, 150);
    };
*/

  
