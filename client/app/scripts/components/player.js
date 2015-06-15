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
      // Called by button on timestamp, sets new startpoint at the 
      // current tapehead pos.
      self.startFromTimestamp = function(){
        self.API.setStartpoint(self.API.timestamp);
        self.API.start(0);
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
      var value = elem.find('span.progress-bar-time');
      var lowLimit = 20; // pixel . . . 
      var highLimit = 844; // pixel. These are bullshit.
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
        // suddenly moves over dot && stop from running off end.
        if (xCoord > lowLimit && xCoord < highLimit){
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

