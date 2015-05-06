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
   var player;

   self.playerState;
   self.initialVideoId = "6XYzbW3bZOQ"; // Miles Davis Live in Stockholm 1972

   // Initial set-up;
   $window.onYouTubeIframeAPIReady = function() {
      console.log("YouTube API ready");
       
      player = new YT.Player('player', {

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
   };

   function getAPI(){
      // Driver
      self.load = function(videoId) { player.loadVideoById(videoId) }; 
      self.cue = function(videoId){ player.cueVideoById(videoId); }; 
      self.play = function() { player.playVideo; };  
      self.pause = function() { player.pauseVideo; };
      self.stop = function() { player.stopVideo; };
      self.seek = function(start) { player.seekTo(start) }; 

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
      getAPI();
   };

   self.onPlayerStateChange = function(e){
               
   };

   self.onPlayerError = function(){


   }; 

   

   
};


youtubePlayerAPI.$inject = ['$window'];

  
