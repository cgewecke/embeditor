(function () {
  'use strict'
/**
 * Embeds a YouTube player instance in the editor page and binds YouTubePlayerAPI callbacks
 * to it. Player options strip the YT UI and ask browser to play inline on mobile (Only
 * works on Android).
 * @directive embed.js
 */
  angular.module('embeditor.components.embed', ['embeditor.services.youtubePlayerAPI'])
    .directive('embeditorYoutubeEmbed', embeditorYoutubeEmbed)

  function embeditorYoutubeEmbed ($window, youtubePlayerAPI) {
    return {
      restrict: 'E',
      link: function (scope, elem, attrs) {
        var playerAPI = youtubePlayerAPI
        var tag
        var firstScriptTag
        var onPlayerStateChangeFn;

        (playerAPI.mobile)
          ? onPlayerStateChangeFn = playerAPI.onMobilePlayerStateChange
          : onPlayerStateChangeFn = playerAPI.onPlayerStateChange;

        tag = document.createElement('script')
        tag.src = ((document.location.protocol === 'http:') ? 'http:' : 'https:') + '//www.youtube.com/iframe_api'
        firstScriptTag = document.getElementById('player')

        // Unit test issue getting parent node here.
        if (firstScriptTag) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
        }

        // Initial set-up;
        $window.onYouTubeIframeAPIReady = function () {
          playerAPI.YT = YT
          playerAPI.player = new YT.Player('player', {
            width: '100%',
            height: '100%',
            videoId: playerAPI.initialVideo.videoId,
            playerVars: {
              'playsinline': '1',    // Phone - inline video
              'iv_load_policy': '3', //
              'controls': '0',       // No Controls
              'disablekb': '1',      // Disable keyboard
              'fs': '0',             // No fullscreen
              'rel': '0',            // No related videos
              'modestbranding': '1', // No logos
              'showinfo': '0'        // No info
            },
            events: {
              'onReady': playerAPI.onPlayerReady,
              'onStateChange': onPlayerStateChangeFn,
              'onError': playerAPI.onPlayerError
            }
          })
        }
      }
    }
  };
  embeditorYoutubeEmbed.$inject = ['$window', 'youtubePlayerAPI']
})();
