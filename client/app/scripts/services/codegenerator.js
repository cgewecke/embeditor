var cg_debug; 

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
         width: 660,
         height: 480
      };

      self.frame = {

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

         // Generate unique ids so multiple <script> based embeds don't conflict
         var functionId = 'embedlam' + Date.now().toString();
         var playerId = 'player' + Date.now().toString();
         var overlayId = 'overlay' + Date.now().toString();
         var n = '\n';

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
         '<div> <div style="position: relative">' + n +
            '<div id="' + overlayId + '" class="embedlam-overlay">' + n +
                  '<div class="embedlam-spinner">' + n +
                     '<div class="embedlam-loader"></div>' + n +
                  '</div>' + n +
               '</div>' + n +
               '<div id="' + playerId + '"></div>' + n +
         '</div></div>' + n +
         
         // SCRIPT
         '<script>' + n +
            
            'var embdebug;' + n +

            // DEFINE EMBEDLAM GLOBALLY TO PREVENT YT IFRAME API DOUBLE LOAD
            '(window.embedlam === undefined) ? window.embedlam = false : window.embedlam = true;' + n +
            // INJECT CSS
            'var css = ' + css + ';' + n +        
            'var head = document.head || document.getElementsByTagName("head")[0];' + n +
            'var style = document.createElement("style");'+ n +
            'style.type = "text/css";'+ n +
            'if (style.styleSheet){'+ n +
              'style.styleSheet.cssText = css;' + n +
            '} else {'+ n + 
              'style.appendChild(document.createTextNode(css));'+ n +
            '}'+ n +
            'head.appendChild(style);' + n +

            // EMBED INSTANCE
            'function ' + functionId + '(){' + n +
               'var tag, firstScriptTag, player, loop, quality, mute, rate, start, end, init, overlay;' + n +

               // Options & Overlay
               'loop = ' + self.options.loop  + ';' + n +
               'quality = "' + self.options.quality + '";' + n +
               'autoplay = ' + self.options.autoplay + ';' + n +
               'mute = ' + self.options.mute + ';' + n +
               'rate = ' + self.options.rate + ';' + n +
               'start = '+ self.options.start + ';' + n +
               'end = ' + self.options.end + ';' + n +
               'init = true;' + 
               'overlay = document.getElementById("' + overlayId + '");' + n +

               // See if YT API already loaded. Skip otherwise
               'if (!window.embedlam){' + n +
                  'tag = document.createElement("script");' + n +             
                  'tag.src = (("http:" === document.location.protocol) ? "http:" : "https:") + "//www.youtube.com/iframe_api";' + n +
                  'firstScriptTag = document.getElementById("' + playerId + '"); ' +       n +      
                  'firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);' +  n +            
                  'window.onYouTubeIframeAPIReady = function(){ loadPlayer(); }'+ n +
               '} else {'+ n +
                  'var timer = setInterval(function(){' + n +
                    'if (typeof YT != "undefined"){' + n + // && Operator is getting urlencoded . . .
                      'if(YT.Player ){' + n +
                        'loadPlayer();' + n +
                        'clearInterval(timer);' + n +
                      '}' + n +
                    '}' + n +
                  '}, 250);' + n +
               '}' + n +

               // Player instance
               'function loadPlayer(){' + n +
                  'embdebug = player = new YT.Player("' + playerId + '", {' + n +
                     'width:' + "'" + self.options.width + "'," + n +
                     'height:' + "'" + self.options.height + "'," + n +
                     'videoId:' + "'" + self.options.videoId + "'," + n +
                     'playerVars:{' + n +
                        'iv_load_policy:' + "'" + self.frame.iv_load_policy + "'," + n +
                        'controls:' + "'" + self.frame.controls + "'," + n +
                        'disablekb:' + "'" + self.frame.disablekb + "'," + n +
                        'fs:' + "'" + self.frame.fs + "'," + n +
                        'modestbranding:' + "'" + self.frame.modestbranding + "'," + n +
                        'showinfo:' + "'" + self.frame.showinfo + "'" + n +
                     '},' + n +
                     'events: {' + n +
                        'onReady: onPlayerReady,' + n +
                        'onStateChange: onPlayerStateChange,' + n +
                        'onError: onPlayerError' + n +
                     '}' + n +
                  '});' + n +
               '};' + n +

         
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
               function onPlayerReady(){\
                player.mute();\
                player.seekTo(start);\
                player.playVideo();\
              };\
               function onPlayerStateChange(event){\
                  if (event.data === YT.PlayerState.PLAYING){\
                     setStop();\
                     if (init){\
                        player.pauseVideo();\
                        player.seekTo(start);\
                        (rate != 1) ? player.setPlaybackRate(rate) : false;\
                        (autoplay) ? player.playVideo() : player.pauseVideo();\
                        init = false;\
                        setTimeout(function(){\
                         overlay.style.visibility = "hidden";\
                         (!mute) ? player.unMute(): false;\
                        }, 250);\
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