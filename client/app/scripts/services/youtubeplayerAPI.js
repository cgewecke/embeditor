'use strict';

/**
 * @ngdoc function
 * @name embeditor.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the embeditor
 */
angular.module('embeditor.services.youtubePlayerAPI', [])
   .service('youtubePlayerAPI', youtubePlayerAPI);

function youtubePlayerAPI($window){

   var self = this;

   self.playerState;
   self.initialVideoId = "6XYzbW3bZOQ"; // Miles Davis Live in Stockholm 1972

   // Initial set-up;
   $window.onYouTubeIframeAPIReady = function() {
      console.log("YouTube API ready");
       
      var player = new YT.Player('player', {

          width:          '854',
          height:         '480',
          videoId:        self.initialVideoId,
          playerVars: {
              'iv_load_policy': '3', //
              'controls': '0', // No Controls
              'disablekb': '1', // Disable keyboard
              'fs': '0',  // No fullscreen
              'rel':            '0', // No related videos
              'modestbranding': '1', // No logos
              'showinfo':       '0', // No info
          },
          events: {
              'onReady': self.onPlayerReady,
              'onStateChange': self.onPlayerStateChange,
              'onError': self.onPlayerError
          }
      });

      getAPI(player);
   };

   function getAPI(player){
      // Driver
      self.load = player.loadVideoById; // params: videoId
      self.cue = player.cueVideoById; // params: videoId
      self.play = player.playVideo;  // params: none
      self.pause = player.pauseVideo; // params: none
      self.stop = player.stopVideo; // params: none
      self.seek = player.seekTo; // params: seconds:Number, allowSeekAhead:Boolean

      // Playback
      self.getRate = player.getPlaybackRate;
      self.setRate = player.setPlaybackRate;
      self.rates = player.getAvailablePlaybackRates;

      // Status
      self.loaded = player.getVideoLoadedFraction;
      self.state = player.getPlayerState;
      self.time = player.getCurrentTime;

      // Video Quality
      self.getQuality = player.getPlaybackQuality;
      self.setQuality = player.setPlaybackQuality;
      self.getLevels = player.getAvailableQualityLevels;

      // Duration
      self.duration = player.getDuration;
   }; 

   // Embed 
   self.embed = function(){
      // Standard You Tube embed code 
      var tag, firstScriptTag;          

      tag = document.createElement('script');
      tag.src = (("http:" === document.location.protocol) ? "http:" : "https:") + "//www.youtube.com/iframe_api";
      firstScriptTag = document.getElementById("player");
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
   };

   // Player Event Listeners
   self.onPlayerReady = function(event){

   };

   self.onPlayerStateChange = function(e){
               
   };

   self.onPlayerError = function(){


   }; 

   

   
};


youtubePlayerAPI.$inject = ['$window'];

  
