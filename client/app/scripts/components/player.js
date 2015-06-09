var pctl_debug, pctl_debugII;

(function(){
  'use strict';

  angular.module('embeditor.components.player', ['embeditor.services.youtubePlayerAPI'])
    
    .controller('PlayerCtrl', playerCtrl )
    .directive('embeditorPlayerTimeBar', embeditorPlayerTimeBar)
    .directive('embeditorSectionPlayerControls', embeditorSectionPlayerControls)  // Unit test wrapper 
    .directive('embeditorSectionApp', embeditorSectionApp); // Unit test wrapper

    /*--------------------- Controller --------------------------------*/
    function playerCtrl($scope, codeGenerator, youtubePlayerAPI, $mdSidenav, embedCodeDialog ){
      var self = this;
      
      self.alignment = 'center center'; // Alignment config relative to sidebar. (open/closed)
      self.API = youtubePlayerAPI;   // Public alias for playerAPI
      self.dialog = embedCodeDialog; // Public alias for the dialog service
      self.code = codeGenerator; // Public alias for the codeGenerator service

      // ------------------------ Public ----------------------------------
      // Called by button on timestamp, sets new startpoint at the 
      // current tapehead pos.
      self.startFromTimestamp = function(){
        console.log('startFromTimestamp: ' + self.API.timestamp);
        self.API.setStartpoint(self.API.timestamp);
        self.API.start(0);
      };

      // Move player block over to right side of page on sideNavOpen
      // return on sidenNav closed. Exception gets thrown unless
      // sideNav has been instantiated at least once.
      self.alignWithSidenav = function(type){ 
         var alignment = 'center center';
         if ($mdSidenav.exists && $mdSidenav('search').isOpen()){
            (type === 'row') ? alignment = 'end center': alignment = 'center end';
         } 
         return alignment;
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
      // set code;
      $scope.$watch('API.loop', function(newval, oldval){
        self.code.set('loop', newval);
      });

      // watch(API.mute): ng-modelled on the mute switch. 
      // Listened for by codeGenerator Service
      $scope.$watch('API.mute', function(newval, oldval){
        if (self.API.videoLoaded && newval != undefined){
            (newval) ? self.API.silence() : self.API.noise();
            self.code.set('mute', newval);
        };        
      });

      $scope.$watch('API.autoplay', function(newval, oldval){
        self.code.set('autoplay', newval);
      });

      // listen for video load - update code 
      $scope.$on('YTPlayerAPI:init', function(){
        self.code.set('videoId', self.API.video.videoId);
      })

      // listen for updates to (API.startpoint, API.endpoint)
      $scope.$on('YTPlayerAPI:set', function(event, msg){
        self.code.set(msg.type, msg.value);
      })
    };
    playerCtrl.$inject = ['$scope', 'codeGenerator', 'youtubePlayerAPI', '$mdSidenav', 'embedCodeDialog'];

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
      var value = elem.find('span.progress-bar-time');
      var lowLimit = 20;
      var highLimit = 844;
      var xCoord = 0;

      scope.showDot = false;
      scope.time = (0).toString().toHHMMSSss();

      // calculateTimeDotValue(): Translates space to time.
      function calculateTimeDotValue(){
        var ratio = (xCoord/854);
        var time = (ctrl.API.endpoint.val - ctrl.API.startpoint.val) * ratio;
      
        return ctrl.API.startpoint.val + time;
      };

      // updateTimeDot: ng-mousemove 
      // Shows dot/time value mapped by location the cursor hovers over. 
      scope.updateTimeDot = function($event){
    
        xCoord = $event.offsetX;
        var offset = elem.offset();
        var dotXPos = (xCoord + 5) + 'px';
        var valueXPos = (offset.left + xCoord - 10) + 'px';
        var valueYPos = (offset.top - 35) + 'px';

        // Ignore false offset values that occur when mouse
        // suddenly moves over dot & stop from running off end.
        if (xCoord > lowLimit && xCoord < highLimit){
          scope.time = calculateTimeDotValue().toString().toHHMMSSss();
          dot.css('left', dotXPos);
          dot.css('visibility', 'visible');
          value.css('left', valueXPos);
          value.css('top', valueYPos);
          value.css('visibility', 'visible');
        }
      };

      scope.hideTimeDot = function(){
        dot.css('visibility', 'hidden');
        value.css('visibility', 'hidden');
      };

      // seekVideoToTimeDot() - ng-clicked. 
      scope.seekVideoToTimeDot = function(){

        //Ignore false offset values
        if (xCoord > lowLimit && xCoord < highLimit){

          var time = calculateTimeDotValue();
          ctrl.API.setTapehead(time);
        }
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

