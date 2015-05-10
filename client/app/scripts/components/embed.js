(function(){
  'use strict';

  angular.module('embeditor.components.embed', ['embeditor.services.youtubePlayerAPI'])
    
    .directive('embeditorYoutubeEmbed', embeditorYoutubeEmbed);
    
    function embeditorYoutubeEmbed($window, youtubePlayerAPI){
      return {
        restrict: 'E',
        link: function(scope, elem, attrs){

          var self = this;
          var playerAPI = youtubePlayerAPI;
          var tag, firstScriptTag;          

          tag = document.createElement('script');
          tag.src = (("http:" === document.location.protocol) ? "http:" : "https:") + "//www.youtube.com/iframe_api";
          firstScriptTag = document.getElementById("player");
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          // Initial set-up;
           $window.onYouTubeIframeAPIReady = function() {
              
              playerAPI.YT = YT; 
              playerAPI.player = new YT.Player('player', {

                  width:          '854',
                  height:         '480',
                  videoId:        playerAPI.initialVideoId,
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
                    'onReady': playerAPI.onPlayerReady,
                    'onStateChange': playerAPI.onPlayerStateChange,
                    'onError': playerAPI.onPlayerError
                  }
              });
           };
        }
      }
    };
    embeditorYoutubeEmbed.$inject = ['$window','youtubePlayerAPI'];

})();