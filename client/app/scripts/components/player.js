var pctl_debug, pctl_debugII;

(function(){
  'use strict';

  angular.module('embeditor.components.player', ['embeditor.services.youtubePlayerAPI'])
    
    .controller('PlayerCtrl', playerCtrl )
    .directive('embeditorPlayerProgressBar', embeditorPlayerProgressBar)
    .directive('embeditorSectionPlayerControls', embeditorSectionPlayerControls);

    function playerCtrl($scope, youtubePlayerAPI, $mdSidenav){
      var self = this;

      self.alignment = 'center center';
      self.API = youtubePlayerAPI;
      $scope.API = youtubePlayerAPI;

      // Called by button on timestamp, sets new startpoint at the 
      // current tapehead location 
      self.startFromTimestamp = function(){
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

      // watch(API.currentRate): ng-modelled on the playback rates slider
      $scope.$watch('API.currentRate', function(newval, oldval){
        if (self.API.videoLoaded){
            self.API.setRate(newval);
        }
      });
    };

    playerCtrl.$inject = ['$scope', 'youtubePlayerAPI', '$mdSidenav'];

    // <embeditor-section-player-controls></embeditor-section-player-controls>
    // Outer tag for player controls that we can access for unit testing.
    function embeditorSectionPlayerControls(){ 
      return{ templateUrl: 'templates/playercontrols.html' 
    }};

    // <embeditor-player-progress-bar></embeditor-player-progress-bar>
    function embeditorPlayerProgressBar(){
      return {
        restrict: 'E',
        link: progressBarEventHandlers,
        controller: playerCtrl,
        template: '\
          <div id="time-bar" layout="row" layout-fill\
            ng-mousemove="updateTimeDot($event)"\
            ng-mouseleave="hideTimeDot()"\
            ng-click="seekVideoToTimeDot()">\
            <ng-md-icon class="progress-bar-icon"\
              icon="lens" size="12" style="fill:rgb(255,82,82)">\
            </ng-md-icon>\
            <span class="progress-bar-time">{{time}}</span>\
            <md-progress-linear class="md-primary"\
              md-mode="determinate" value="100">\
            </md-progress-linear>\
          </div>\
          '
      };
    };
  
    function progressBarEventHandlers(scope, elem, attr, ctrl){
      
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
        console.log('in updateTimeDot');
        pctl_debugII = $event;
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
          ctrl.API.timestamp = time;
          ctrl.API.seek(time);
        }
      };

    };

})();

