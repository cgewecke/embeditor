(function(){ 
   'use strict';
   angular.module('embeditor.services.codeGenerator', [])
      .service('codeGenerator', codeGenerator);
  
   function codeGenerator(){
      var self = this;

      self.options = {
         videoId: undefined,
         quality: 'auto',
         autoplay: 'false',
         loop: 'false',
         mute: 'false',
         rate: '1.0',
         start: '0.0',
         end: '0.0',
      };

      self.frame = {
         width: 854,
         height: 480,
         iv_load_policy: 3,
         controls: 0,
         disablekb: 1,
         fs: 0,
         rel: 0,
         modestbranding: 1, 
         showinfo: 0
      };

      self.set = function(option, value){
         (value != undefined ) ? self.options[option] = value.toString() : false;
      };

      self.iframe = function(){ 
         return '<iframe src="http://fake/embed/123456789"></iframe>';
      };

      self.script = function(){

         return ('\
         <div id="player"></div>\
         <script>\
            var tag, firstScriptTag, player, loop, quality, mute, speed, start, end, init;\
            tag = document.createElement("script");\
            tag.src = (("http:" === document.location.protocol) ? "http:" : "https:") + "//www.youtube.com/iframe_api";\
            firstScriptTag = document.getElementById("player");\
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);\
            window.onYouTubeIframeAPIReady = function() {\
            player = new YT.Player("player", {' +
               'width:' + "'" + self.frame.width + "'," +
               'height:' + "'" + self.frame.height + "'," +
               'videoId:' + "'" + self.options.videoId + "'," +
               'playerVars:{' +
                  'iv_load_policy:' + "'" + self.frame.iv_load_policy + "'," +
                  'controls:' + "'" + self.frame.controls + "'," +
                  'disablekb:' + "'" + self.frame.disablekb + "'," +
                  'fs:' + "'" + self.frame.fs + "'," +
                  'modestbranding:' + "'" + self.frame.modestbranding + "'," +
                  'showinfo:' + "'" + self.frame.showinfo + "'," +
               'events: {' +
                  'onReady: onPlayerReady,' + 
                  'onStateChange: onPlayerStateChange,' +
                  'onError: onPlayerError}});' + 

            'loop = ' + self.options.loop + ';' +
            'quality = ' + self.options.quality + ';' +
            'mute = ' + self.options.autoplay + ';' +
            'mute = ' + self.options.mute + ';' +
            'rate = ' + self.options.rate + ';' +
            'start = ' + self.options.start + ';' + 
            'end = ' + self.options.end + ';' +
            'init = true' + 

            '\
            function setStop(){var timer;var offset = 0.150;\
               timer = setInterval(function(){\
                 var time = player.time();\
                 if (time >= (end - offset)){\
                   (!loop) ? player.pause() : player.seek(start);\
                   clearInterval(timer);}}, 150);};\
            function onPlayerReady(){player.seek(start);player.play();};\
            function onPlayerStateChange(event){\
               if (event.data === YT.PlayerState.PLAYING){\
                  setStop();\
                  if (init){\
                     (mute) ? player.mute() : false;\
                     (speed != 1) ? player.setPlaybackRate(rate) : false;\
                     (autoplay) ? player.play() : player.pause();\
                     init = false;}}}\
            function onPlayerError(){console.error("Please inform your local constable\
                that a very dangerous patient is missing from the premises. Her name is YouTube.");}'

         );
      };

   };  

})()