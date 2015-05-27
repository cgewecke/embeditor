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
         width: 660,
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

         var functionId = 'embedlam' + Date.now().toString();
         var playerId = 'player' + Date.now().toString();
         var overlayId = 'overlay' + Date.now().toString();

         var css = '"\
            .embedlam-overlay{\
              position: absolute;\
              visibility: visible;\
              top: 0;\
              left: 0;\
              background-color: #757575;\
              height: 100%;\
              width: 100%;\
            }\
            .embedlam-spinner {\
              position: relative;\
              top: 50%;\
              transform: translateY(-50%);\
            }\
            .embedlam-loader {\
              margin: 0 auto;\
              font-size: 10px;\
              position: relative;\
              text-indent: -9999em;\
              border-top: 1.1em solid rgba(255, 255, 255, 0.2);\
              border-right: 1.1em solid rgba(255, 255, 255, 0.2);\
              border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);\
              border-left: 1.1em solid #ffffff;\
              -webkit-transform: translateZ(0);\
              -ms-transform: translateZ(0);\
              transform: translateZ(0);\
              -webkit-animation: load8 1.1s infinite linear;\
              animation: load8 1.1s infinite linear;\
            }\
            .embedlam-loader,\
            .embedlam-loader:after {\
              border-radius: 50%;\
              width: 10em;\
              height: 10em;\
            }\
            @-webkit-keyframes load8 {\
              0% {\
                -webkit-transform: rotate(0deg);\
                transform: rotate(0deg);\
              }\
              100% {\
                -webkit-transform: rotate(360deg);\
                transform: rotate(360deg);\
              }\
            }\
            @keyframes load8 {\
              0% {\
                -webkit-transform: rotate(0deg);\
                transform: rotate(0deg);\
              }\
              100% {\
                -webkit-transform: rotate(360deg);\
                transform: rotate(360deg);\
              }\
            }"';
   
         return (

         // HTML    
         '<div> <div style="position: relative">' +
            '<div id="' + overlayId + '" class="embedlam-overlay">' +
                  '<div class="embedlam-spinner">' +
                     '<div class="embedlam-loader"></div>' +
                  '</div>' +
               '</div>' +
               '<div id="' + playerId + '"></div>' +
         '</div></div>' + 
         
         // SCRIPT
         '<script>' +
            
            'var embdebug;' + 

            // DEFINE EMBEDLAM GLOBALLY TO PREVENT YT IFRAME API DOUBLE LOAD
            '(window.embedlam === undefined) ? window.embedlam = false : window.embedlam = true;' +
            // INJECT CSS
            'var css = ' + css + ';' +         
            'var head = document.head || document.getElementsByTagName("head")[0];' +
            'var style = document.createElement("style");'+
            'style.type = "text/css";'+
            'if (style.styleSheet){'+
              'style.styleSheet.cssText = css;' +
            '} else {'+
              'style.appendChild(document.createTextNode(css));'+
            '}'+
            'head.appendChild(style);' + 

            // EMBED INSTANCE
            'function ' + functionId + '(){' +
               'var tag, firstScriptTag, player, loop, quality, mute, speed, start, end, init, overlay;' +

               // Options & Overlay
               'loop = ' + self.options.loop  + ';' +
               'quality = "' + self.options.quality + '";' +
               'autoplay = ' + self.options.autoplay + ';' +
               'mute = ' + self.options.mute + ';' +
               'rate = ' + self.options.rate + ';' +
               'start = '+ self.options.start + ';' +
               'end = ' + self.options.end + ';' + 
               'init = true;' + 
               'overlay = document.getElementById("' + overlayId + '");' +

               // See if YT API already loaded. Skip otherwise
               'if (!window.embedlam){' +
                  'tag = document.createElement("script");' +              
                  'tag.src = (("http:" === document.location.protocol) ? "http:" : "https:") + "//www.youtube.com/iframe_api";' +
                  'firstScriptTag = document.getElementById("' + playerId + '"); ' +             
                  'firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);' +              
                  'window.onYouTubeIframeAPIReady = function(){ loadPlayer(); }'+
               '} else {'+
                  'var timer = setInterval(function(){' +
                    'if (typeof YT != "undefined" && YT.Player ){' +
                      'loadPlayer();' +
                      'clearInterval(timer);' +
                    '}' +
                  '}, 250);' +
               '}' +

               // Player instance
               'function loadPlayer(){' + 
                  'embdebug = player = new YT.Player("' + playerId + '", {' +
                     'width:' + "'" + self.frame.width + "'," +
                     'height:' + "'" + self.frame.height + "'," +
                     'videoId:' + "'" + self.options.videoId + "'," +
                     'playerVars:{' +
                        'iv_load_policy:' + "'" + self.frame.iv_load_policy + "'," +
                        'controls:' + "'" + self.frame.controls + "'," +
                        'disablekb:' + "'" + self.frame.disablekb + "'," +
                        'fs:' + "'" + self.frame.fs + "'," +
                        'modestbranding:' + "'" + self.frame.modestbranding + "'," +
                        'showinfo:' + "'" + self.frame.showinfo + "'" + 
                     '},' + 
                     'events: {' +
                        'onReady: onPlayerReady,' + 
                        'onStateChange: onPlayerStateChange,' + 
                        'onError: onPlayerError' +
                     '}' +
                  '});' +
               '};' + 

         
               // Embed driver 
               '\
               function setStop(){var timer;var offset = 0.150;\
                  timer = setInterval(function(){\
                    var time = player.getCurrentTime();\
                    if (time >= (end - offset)){\
                      (!loop) ? player.pauseVideo() : player.seekTo(start);\
                      clearInterval(timer);\
                    }\
                  }, 150);\
               };\
               function onPlayerReady(){player.mute(); player.seekTo(start);player.playVideo();};\
               function onPlayerStateChange(event){\
                  if (event.data === YT.PlayerState.PLAYING){\
                     setStop();\
                     if (init){\
                        player.pauseVideo();\
                        player.seekTo(start);\
                        (speed != 1) ? player.setPlaybackRate(rate) : false;\
                        (autoplay) ? player.playVideo() : player.pauseVideo();\
                        (!mute) ? player.unMute(): false;\
                        init = false;\
                        setTimeout(function(){ overlay.style.visibility = "hidden" }, 250);\
                     }\
                  }\
               };\
               function onPlayerError(){ console.error("Her name is YouTube."); };\
            };' +
            
            // Do it. 
            functionId + '();' + 

         '</script>');
      };

   };  
   // 
})()