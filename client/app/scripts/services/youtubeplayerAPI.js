(function(){ 'use strict';
/**
 * An interface to drive the YouTube player so it plays looping, variable speed clips whose duration
 * and boundaries can be changed dynamically by the apps UI. 
 * @service YouTubePlayerAPI
 */
angular.module('embeditor.services.youtubePlayerAPI', []).service('youtubePlayerAPI', youtubePlayerAPI);

function youtubePlayerAPI($rootScope, $timeout, $interval ){

    // Private Variables
    var self = this;
    var scope = $rootScope;
    var timeout = null;          // $timeout promise - cancelled at killStop()
    var interval = null;         // $interval promise - cancelled at killStop()
    var mobileBuffering = false; // State var needed for player init seq. in mobile.
    
    // Const
    var PLAYING = 1, PAUSED = 2, BUFFERING = 3, UNSTARTED = -1, SET = 4;

    // Published Events
    var readyEvent = {name: 'YTPlayerAPI:ready'}                // Cast when initialization is complete in playerStateChange
    var initEvent = {name: 'YTPlayerAPI:init'};                 // Cast on video load, either at init or on search play
    var loadEvent = {name: 'YTPlayerAPI:load'};
    var updateEvent = {name: 'YTPlayerAPI:update'};             // Cast when tapehead is reset to start/endpoint
    var setEvent = {name: 'YTPlayerAPI:set'};                   // Cast when start/endpoints vals change
    var playerLoadedEvent = {name: 'YTPlayerAPI:playerLoaded'}; // Cast when YT fires the player ready event

    // Public Variables   
    self.YT;                        // The YT API wrapper
    self.player;                    // The YT API methods accessor
    self.video;                     // Current video
    self.timestamp = 0.00           // Current playhead position
    self.loadState = 0.00;          // Fractional percentage loaded
    self.percentPlayed = 0.00;      // Location of tapehead as percentage of current time window
    self.currentRate = 1;           // Normal playback rate
    self.speeds = false;            // Has playback rate options ?
    self.initializing = true;       // True as page loads, false once tapehead has been set in inital pos.
    self.mobileStart = false;       // True when player is ready, false once it's tapped.
    self.setNewRate = false;        // True during video load, triggers rate set when rates become avail.
    self.videoLoaded = false;       // False during video load, true when the stream initiates.
    self.minLengthWarning = false;  // True when start/endpoints are 1 sec apart, false otherwise.
    self.loop = true;               // When true, player loops back to startpoint from endpoint
    self.mute = false;              // When true, player is muted. 
    self.autoplay = false;          // When true, embed will auto-play on iframe load
    
    self.PLAYING = PLAYING;         // Public constants for the DOM
    self.PAUSED = PAUSED;           // Public constants for the DOM
        
    self.state = PAUSED;            // Vals: PLAYING or PAUSED, toggles icon. 
    self.frameLength = .05;
    self.startpoint = { val: 0.00, display: '0:00.00'};
    self.endpoint = { val: 0.00, display: '0:00.00'};
    self.initialVideo = null;

    // Determines opening sequence eventing . . . .
    self.mobile = ( navigator.userAgent.match(/(iPad|iPhone|iPod|Android)/g) ? true : false );
    self.phone = ( navigator.userAgent.match(/(iPod|iPhone|Android)/g) ? true : false );
    self.android = ( navigator.userAgent.match(/(Android)/g) ? true : false );

    self.initialVideo = {
        imageUrl: "https://i.ytimg.com/vi/XarVd2TSmqI/mqdefault.jpg",
        seconds: 379,
        title: "Taylor Swift Interview | Screen Test | NYT ",
        videoId: "XarVd2TSmqI"
    };
     
    // For unit tests - events etc
    self.scope = $rootScope; 
    scope.self = self;

    // ---------------------------------------  Utilities  ---------------------------------------

    /**
     * Initializes service from the YT playerReady callback on desktop page load. 
     * Load/mutes initial video, 
     * @method init
     */
    function init(){
        var timer;
        self.load(self.initialVideo);
        self.silence();
    };
    /**
     * Initializes service from the YT playerReady callback on mobile page load. Broadcasts
     * a playerLoaded event (Necessary because mobile will not autoplay and trigger its
     * own 'play' event)
     * @method  mobileInit 
     */
    function mobileInit(){
        var timer;    
        self.load(self.initialVideo);
        self.mobileStart = true;
        $rootScope.$broadcast(playerLoadedEvent.name);
        
    }
    /**
     * Calculates/sets percentage loaded value (Deprecated).
     * @method  setLoadState 
     */
    function setLoadState(){
        var timer, offset;

        timer = $interval(function(){
            // Load Progress
            if (self.percentLoaded()){
                self.loadState = self.percentLoaded() * 100;
            }
            // Play Progress
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
    /**
     * Verifies that playback speed options are available and sets the player's playback rate. 
     * Rates info only available once the player starts playing (and only on Desktop), so 
     * this executes in the  YT state change callback. Rate setting carries over from video to video.
     * @method  verifyRates 
     */
    function verifyRates(){

        (!self.mobile && self.rates().length > 1)  
            ? self.speeds = true 
            : self.speeds = false;

        if (self.speeds && self.setNewRate){
            self.setRate(self.currentRate);
            self.setNewRate = false;
        }
    }

    //----------------------------------------- Timers -----------------------------------------------
    /**
     * Sets up an interval timer to update the timestamp and a timeout to execute
     * when the end of the clip is reached. Either loops or stops on endpoint. Called
     * on non-initial-load changes to 'playing' state in onPlayerStateChange() AND under
     * 'continuing play' conditions in reset(), when the start/endpoints are reset.
     * @method  setStop 
     * @param {Boolean} looping 
     */
    function setStop(looping){
    
        var ms;

        if (looping){
            ms = timeoutCompleteClipLength();
        } else {
            killStop();
            ms = timeoutLength();       
        }

        // Update timestamp as we play.
        interval = $interval(function(){ self.timestamp = self.time() }, 150);

         // If we are playing & looping, loop back to startpoint.
        timeout = $timeout(function(){
                
                (!self.loop) ?
                    self.pause():
                    self.seek(self.startpoint.val);

                killStop(true); 
        }, ms );
    };
    /**
     * Cancels timers created in setStop. Called from within setStop when the 
     * timeout executes, from within setRates because a rate change alters the 
     * playing time duration, and from within reset in the 'continue play' condition, 
     * because old starts/stops must be abandoned.
     * @method  killStop 
     * @param {Boolean} looping 
     */
    function killStop(looping){
        
        $interval.cancel(interval);
        $timeout.cancel(timeout);

        // Handle safari case. Redundant in FF and chrome because seek fires player events. 
        (looping ) ?
            setStop(looping) :
            false;
    }
    /**
     * Gets duration for $timeout, calibrated to playback rate.
     * @method  timeoutLength 
     * @return {Number} milliseconds
     */
    function timeoutLength(){

        var ms = Math.floor( (self.endpoint.val - self.time()) * 1000 );

        if (self.currentRate == 0.5) return (ms * 2);
        if (self.currentRate == 1 ) return (ms);
        if (self.currentRate == 1.5) return Math.floor(ms * .66);
        
        return ms;
    }
    /**
     * Calculates real time length of clip as a function of its playback rate.
     * @method  timeoutCompleteClipLength 
     * @return {Number} milliseconds
     */
    function timeoutCompleteClipLength(){
        var ms = Math.floor( (self.endpoint.val - self.startpoint.val) * 1000 );
        if (self.currentRate == 0.5) return (ms * 2);
        if (self.currentRate == 1 ) return (ms);
        if (self.currentRate == 1.5) return Math.floor(ms * .66);
        return ms; 
    }
    // ---------------------------- YouTube Player API Wrapper ----------------------------------
    
    /**
     * Binds YouTube Player methods to this service. Runs in YT's playerReady callback when 
     * javascript api is available. 
     * @method getAPI 
     */
    function getAPI(){

        /**
         * Wraps YT loadVideoById. Implements different load strategies for desktop and mobile
         * because the latter prohibits autoplaying. 
         * @method load 
         * @param  {Object} video 
         */
        self.load = function(video) { 
            var timer;

            self.video = video;
            self.setNewRate = true;
            self.videoLoaded = false;

            // Desktop: Load on init & search play. 
            // Tablet: Load on search play
            (!self.mobile || (self.mobile && !self.phone && !self.initializing) ) ?
                self.player.loadVideoById(video.videoId):
                false;

            // Phone app: Cue on search play
            (self.phone && !self.initializing) ?
                self.player.cueVideoById(video.videoId):
                false;

            self.setStartpoint(0);
            self.setEndpoint(video.seconds);
            setLoadState();
            
            $rootScope.$broadcast(initEvent.name);
        }; 
        
        self.play = function() { 
            self.state = PLAYING;
            self.player.playVideo(); 
        };  

        self.pause = function() { 
            self.state = PAUSED;
            self.player.pauseVideo(); 
        };
        self.seek = function(location) {    
            self.player.seekTo(location);
        };

        // A version of seek that prevents scrubbing using the slider for IPad,
        // since this is breaking the YT post-message interface about 20%
        // of the time & decoupling the app from the player. False means don't buffer the
        // the stream
        self.seek_mobile = function(location){
            self.player.seekTo(location, false);
        } 

        // Playback speed
        self.rates = function(){ return self.player.getAvailablePlaybackRates() };
        self.getRate = function(){ return self.player.getPlaybackRate() };
        self.setRate = function(rate){ 

            self.player.setPlaybackRate(rate);
            
            (self.state === PLAYING) ? 
                setStop() : 
                killStop();
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
    

    // ----------------------------- App Interface --------------------------------------------

    // Play/Pause
    /**
     * Pauses video when playing. Plays video when paused.
     * @method  togglePlay 
     */
    self.togglePlay = function(){
        var time;
        if (self.initializing) return;  
        
        // Pause / Play
        if ( self.state === PLAYING ){
            self.pause();
        } else {
            // Seek to start first if pos is clip end
            if ((self.time() + .25) > self.endpoint.val){
                self.seek(self.startpoint.val);
                self.play();
            } else {
                self.play();
            }
        }
    };
    /**
     * Sets startpoint at a value relative to current startpoint and seeks to that position.
     * * Broadcasts updateEvent.
     * @method  start 
     * @param  {Number} change  +/- floating point seconds from current startpoint value.
     * @param  {Boolean} disableWarning   prevent proximity warning from being displayed.
     */
    self.start = function(change, disableWarning){
     
        var time = self.startpoint.val + change;
        
        // Don't get closer than 1 sec from endpoint
        if (time >= self.endpoint.val - 1 ){
             
             time = self.endpoint.val - 1;
             
             (!disableWarning)  
                ? self.minLengthWarning = true 
                : false;
        
        } else self.minLengthWarning = false;
    
        // Don't go before video start.
        if (time < 0) time = 0;

        self.pause();

        $timeout(function(){
            self.setStartpoint(time);
            self.seek(time);
            self.timestamp = time;
            $rootScope.$broadcast(updateEvent.name);
        });
    };
    /**
     * Sets endpoint at a value relative to current endpoint and seeks to that position. 
     * Broadcasts updateEvent.
     * @method  end 
     * @param  {Number} change  +/- floating point seconds from current endpoint value.
     * @param  {Boolean} disableWarning   prevent proximity warning from being displayed.
     */
    self.end = function(change, disableWarning){
     
        var time = self.endpoint.val + change;

        // Don't get closer than 1 sec from startpoint
        if (time <= self.startpoint.val + 1 ){
            
            time = self.startpoint.val + 1;

            (!disableWarning)  
                ? self.minLengthWarning = true 
                : false;
        
        } else self.minLengthWarning = false;

        // Don't exceed video length
        if (time > self.video.seconds) time = self.video.seconds;

        self.pause();

        $timeout(function(){
            self.setEndpoint(time);
            self.seek(time);
            self.timestamp = time;
            $rootScope.$broadcast(updateEvent.name);
        });
    };
    /**
     * Sets startpoint at specified value. Broadcasts setEvent. 
     * @method  setStartPoint 
     * @param  {Number} value  floating point seconds
     */
    self.setStartpoint = function(value){
        self.startpoint = {val: value, display: value.toString().toHHMMSSss() };
        $rootScope.$broadcast(setEvent.name, {type: 'start', value: value });
    };

    /**
     * Sets endpoint at specified value. Broadcasts setEvent. 
     * @method  setEndPoint 
     * @param  {Number} value  floating point seconds
     */
    self.setEndpoint = function(value){
        self.endpoint = {val: value, display: value.toString().toHHMMSSss() };
        $rootScope.$broadcast(setEvent.name, {type: 'end', value: value });
    };
    /**
     * Seeks to and begins playing from the startpoint
     * @method  replayStart 
     */
    self.replayStart = function(){

        self.pause(); // Force mobile event
        self.seek(self.startpoint.val);
        self.play();
    };
    /**
     * Seeks to and begins playing from the endpoint
     * @method  replayEnd 
     */
    self.replayEnd = function(){

        var newTime = self.endpoint.val - 2;
        if (newTime < (self.startpoint.val + 1)) 
            newTime = self.startpoint.val;

        self.pause(); // Force mobile event
        self.seek(newTime);
        self.play();
    }
    /**
     * Resets the start/stop back to video min/max. Broadcasts update
     * events for start/end points. Resets loop timers.
     * @method  reset
     */
    self.reset = function(){

        // Start
        self.setStartpoint(0);
        $rootScope.$broadcast(updateEvent.name);
        // End
        self.setEndpoint(self.video.seconds);
        $rootScope.$broadcast(updateEvent.name);

        self.minLengthWarning = false;

        // Keep state: play -> continue playing: paused -> do nothing.
        // Reset timers
        (self.state === PLAYING)
            ? setStop()
            : killStop();
    }
    /**
     * Sets tapehead & timestamp to value.
     * @method  setTapehead 
     * @param {Number} time floating point seconds
     */
    self.setTapehead = function(time){

        // Update timestamp for a paused seek.
        (self.state !== PLAYING ) ? 
            self.timestamp = time : 
            false;

        // Destop playing or mobile paused: just seek
        if (!self.mobile || self.state !== PLAYING ){
            self.seek(time);

        // Mobile playing: player events need to be forced to reset timers.
        // Seek() doesn't automatically fire anything.
        } else {
            self.pause();
            self.seek(time);
            self.play();
        }
    };
    /**
     * Callback fired when the YouTube player is available.
     * @method  onPlayerReady description]
     * @param  {Event} YouTube playerReady event
     */
    self.onPlayerReady = function(event){
        
        getAPI();

        (self.mobile) 
            ? mobileInit() 
            : init();
    };

    /**
     * Callback fired on desktop when the YouTube player changes state. Manages response to
     * 'playing' and 'buffering' states.
     * @method  
     * @param  {Event} YouTube playerStateChange event
     */
    self.onPlayerStateChange = function(event){
        
        if (event.data === PLAYING){
            self.videoLoaded = true; // Rate & Quality assets now available
            
            // On page load, pause opening play, make player visible,
            // Get playback rates. Start/End vals are specific to 
            // initial vid 
            if (self.initializing){
                
                self.pause();  
                self.noise();
                self.setStartpoint(78.44);  
                self.setEndpoint(84.18);
                self.start(0);     
                verifyRates();
                
                $timeout(function(){ 
                    self.initializing = false; 
                    $rootScope.$broadcast(readyEvent.name);
                }, 1000);
                

            // Check end because this might be a player click at 
            // the end of the video (by passing togglePlay().
            // It needs to start at clip beginning
            } else if ((self.time() + .25) > self.endpoint.val){

                self.pause();
                self.seek(self.startpoint.val);
                self.play();

            // All other plays, including the loading play when a 
            // a search item is selected.  
            } else {
                
                self.state = PLAYING; 
                verifyRates();
                setStop();        
            }
        } else if ( event.data === BUFFERING ) {
    
            self.state = PAUSED;
            killStop();
            
        } else {
        
            self.state = PAUSED;
            killStop();
        }
        $rootScope.$apply();
    };

    /**
     * Callback fired on mobile when the YouTube player changes state. Manages response to
     * 'playing' and 'buffering' states.
     * @method  
     * @param  {Event} YouTube playerStateChange event
     */
    self.onMobilePlayerStateChange = function(event){
    
        if (event.data === PLAYING){
                    
            // Init: player has been tapped. Set start, remove cover.        
            if (self.initializing){
                
                // IPhone, IPad, ITouch
                if (!self.android){

                    self.pause();
        
                    $timeout(function(){ 
                        self.initializing = false; 
                        $rootScope.$broadcast(readyEvent.name);
                    }, 1000);
                
                // Android - pause inside timeout, otherwise player screen
                // is black.
                } else {
                    $timeout(function(){ 
                        self.pause();
                        self.initializing = false; 
                        $rootScope.$broadcast(readyEvent.name);
                    }, 1000);
                }

            // Check end because this might be a player tap at 
            // the end of the video on non-loop (by-passing togglePlay().
            // It needs to start at clip beginning
            } else if ((self.time() + 1) > self.endpoint.val){

                self.pause();
                self.seek(self.startpoint.val);
                self.play();
            
            // Regular play
            } else {
                    
                self.state = PLAYING; 
                setStop();
            }

        // Buffering - timers invalid as stream loads
        } else if (event.data === BUFFERING ) {

            self.state = PAUSED;
            killStop();
            
        // First tap: initial state - remove instructions, show spinner   
        } else if (event.data === UNSTARTED && self.initializing ){

            self.mobileStart = false;
        
        // Paused
        } else {
            self.state = PAUSED;
            killStop();
        }
        $rootScope.$apply();
    };
};
youtubePlayerAPI.$inject = ['$rootScope', '$timeout', '$interval'];


// End closure.
})();

/* // Godard - Gimme Shelter: 'seconds' MUST BE 2 SECONDS SHORT OF THE END . . . .
self.initialVideo = {
    seconds: 272, 
    imageUrl: "https://i.ytimg.com/vi/4kpP6Bjwx-w/mqdefault.jpg",
    title: "JEAN-LUC GODARD FILMS - THE ROLLING STONES - GIMME SHELTER",
    videoId: "4kpP6Bjwx-w"
}; 
*/
    
