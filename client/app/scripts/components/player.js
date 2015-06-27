var pctl_debug, pctl_debugII;

(function(){
  'use strict';

  angular.module('embeditor.components.player', [
    
    'ngMaterial',
    'embeditor.components.embedcodedialog',
    'embeditor.services.youtubePlayerAPI', 
    'embeditor.services.codeGenerator',
    'embeditor.services.layoutManager' 

    ])
    
    .controller('PlayerCtrl', playerCtrl )
    .directive('embeditorPlayerTimeBar', embeditorPlayerTimeBar)
    .directive('embeditorSectionPlayerControls', embeditorSectionPlayerControls)  
    .directive('embeditorSectionApp', embeditorSectionApp);                       

    /*--------------------- Controller --------------------------------*/
    function playerCtrl($scope, codeGenerator, youtubePlayerAPI, $mdSidenav, embedCodeDialog, layoutManager ){
      var self = this;
      
      self.API = youtubePlayerAPI;   
      self.dialog = embedCodeDialog; 
      self.code = codeGenerator; 
      self.layout = layoutManager; 

      // ------------------------ Public ----------------------------------
      // Called by button on timestamp, sets new start/end point at the 
      // current tapehead pos.
      self.startFromTimestamp = function(){
        self.API.setStartpoint(self.API.timestamp);
        self.API.start(0);
      };

      self.endFromTimestamp = function(){
        self.API.setEndpoint(self.API.timestamp);
        self.API.end(0);
      };

      // ----------------------- Watches -------------------------------
      // Call relevant API functions and/or update the code generator values

      // watch(API.currentRate): ng-modelled on the playback rates slider
      $scope.$watch('API.currentRate', function(newval, oldval){
        if (self.API.videoLoaded){
            self.API.setRate(newval);
            self.code.set('rate', newval);
        }
      });

      // watch(API.loop): ng-modelled on the loop switch. 
      $scope.$watch('API.loop', function(newval, oldval){
        self.code.set('loop', newval);
      });

      // watch(API.mute): ng-modelled on the mute switch. 
      $scope.$watch('API.mute', function(newval, oldval){
        if (self.API.videoLoaded && newval != undefined){
            (newval) ? self.API.silence() : self.API.noise();
            self.code.set('mute', newval);
        };        
      });

      // watch(API.autoplay): ng-modelled on the auto switch. 
      $scope.$watch('API.autoplay', function(newval, oldval){
        self.code.set('autoplay', newval);
      });

      // ----------------------- Events ------------------------------
      
      // listen for video load - update codeGen videoId
      $scope.$on('YTPlayerAPI:init', function(){
        self.code.set('videoId', self.API.video.videoId);
        self.code.set('title', self.API.video.title);
        self.code.set('imageUrl', self.API.video.imageUrl);
      })

      // listen for updates to (API.startpoint, API.endpoint)
      $scope.$on('YTPlayerAPI:set', function(event, msg){
        self.code.set(msg.type, msg.value);
      })
    };
    playerCtrl.$inject = ['$scope', 'codeGenerator', 'youtubePlayerAPI', '$mdSidenav', 
                          'embedCodeDialog', 'layoutManager'];

    /*------------------------- Time Bar Directive --------------------------------*/
    /*-------------------- <embeditor-player-time-bar> -------------------------------*/

    function embeditorPlayerTimeBar(){
      return {
        restrict: 'E',
        link: timeBarEventHandlers,
        controller: playerCtrl,
        templateUrl: 'templates/timebar.html'    
      };
    };
  
    function timeBarEventHandlers(scope, elem, attr, ctrl){
      
      var dot = elem.find('ng-md-icon');
      var tapehead = elem.find('span.tapehead-animation-wrapper');
      var value = elem.find('span.progress-bar-time');

      var lowLimit = 20; // pixel . . . 
      var highLimit = 844; // pixel. These are bullshit.
      var xCoord = 0;

      scope.showDot = false;
      scope.timestamp = ctrl.API.timestamp;
      scope.time = (0).toString().toHHMMSSss();
      scope.API = ctrl.API; // Ref for timestamp animation $watch

      // ---------------- Time Dot Animation ---------------------------------

      // calculateTimeDotValue(): Translate space to time.
      function calculateTimeDotValue(){
        var ratio = (xCoord/854);
        var time = (ctrl.API.endpoint.val - ctrl.API.startpoint.val) * ratio;
      
        return ctrl.API.startpoint.val + time;
      };


      // updateTimeDot: ng-mousemove 
      // Shows dot/time value mapped by location the cursor hovers over. 
      scope.updateTimeDot = function($event){
    
        xCoord = $event.offsetX === undefined ? $event.originalEvent.layerX : $event.offsetX;
      
        console.log('xcoord: ' + xCoord);
        pctl_debug = $event;
        var offset = elem.offset();
        var dotXPos = (xCoord + 5) + 'px';
        var valueXPos = (offset.left + xCoord - 10) + 'px';
        var valueYPos = (offset.top - 35) + 'px';

        // Ignore false offset values that occur when mouse
        // suddenly moves over dot && stop from running off end.
        if (xCoord > lowLimit && xCoord < highLimit){
          console.log('within visible section');
          scope.time = calculateTimeDotValue().toString().toHHMMSSss();
          dot.css('left', dotXPos);
          dot.css('visibility', 'visible');
          value.css('left', valueXPos);
          value.css('top', valueYPos);
          value.css('visibility', 'visible');
        } else {
          scope.hideTimeDot();
        }
      };

      // hideTimeDot: ng-mouseleave
      scope.hideTimeDot = function(){
        dot.css('visibility', 'hidden');
        value.css('visibility', 'hidden');
      };

      // seekVideoToTimeDot() - ng-click. 
      scope.seekVideoToTimeDot = function(){

        //Ignore false offset values
        if (xCoord > lowLimit && xCoord < highLimit){

          var time = calculateTimeDotValue();
          ctrl.API.setTapehead(time);
        }
      };

      // ----------------   Tapehead Animation ----------------------------- 
      
      // Bind to API.timestamp
      scope.$watch('API.timestamp', function(newval, oldval){
        (newval) ? updateTapehead() : false;
      });

      // Listen for start/end val updates, because the timeline gets
      // rebased then.
      scope.$on('YTPlayerAPI:update', function(newval, oldval){
        (newval) ? updateTapehead() : false;
      })

      // updateTapehead() Translate cur tapehead pos to timebar space.
      function updateTapehead(){
        var clipDuration, ratio, newPosition;
        
        var playerWidth = 854; // Pixel - bullshit
        var timestampWidth = 14; // Pixel - bullshit

        clipDuration = (ctrl.API.endpoint.val - ctrl.API.startpoint.val);
        ratio = (ctrl.API.timestamp - ctrl.API.startpoint.val) /clipDuration;
        newPosition = Math.floor( 854 * ratio );

        // Either update or detect end and stop for the last few pixels
        (newPosition < (playerWidth - timestampWidth)) ?
          tapehead.css('left', newPosition):
          tapehead.css('left', (playerWidth - timestampWidth));
      };


    };

    /*--------------------- (SECTION DIRECTIVE FOR UNIT TESTING ) --------------------------------*/
    //---------------------- <embeditor-section-player-controls> ----------------------------------
    //---------------------- <embeditor-section-app> ----------------------------------
    function embeditorSectionPlayerControls(){ 
      return{ templateUrl: 'templates/playercontrols.html' }
    };

    function embeditorSectionApp(){
      return { templateUrl: 'templates/player.html' }
    };

    
})();

