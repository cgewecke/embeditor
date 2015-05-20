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
          <div layout="row" layout-fill>\
            <ng-md-icon class="progress-bar-icon"\
              icon="lens" size="12" style="fill:rgb(255,82,82)">\
              <md-tooltip md-direction="top">{{time}}</md-tooltip>\
            </ng-md-icon>\
            <md-progress-linear class="md-primary"\
              md-mode="determinate" value="100">\
            </md-progress-linear>\
          </div>'
      };
    };

    function progressBarEventHandlers(scope, elem, attr, ctrl){
      
      var dot = elem.find('ng-md-icon');
      var xCoord = 0;

      scope.showDot = false;
      scope.time = (0).toString().toHHMMSSss();

      function calculateTimeValue(){
        var ratio = (xCoord/854);
        var newTime = (ctrl.API.endpoint.val - ctrl.API.startpoint.val) * ratio;
      
        return ctrl.API.startpoint.val + newTime;
      };

      // mouseenter() Shows dot/time value represented by the
      // location the cursor hovers over. We have to save offsetX
      // value to xCoord because it won't be correct on the $event
      // data once the dot materializes.
      elem.bind('mousemove', function($event){
        xCoord = $event.offsetX;
        scope.time = calculateTimeValue().toString().toHHMMSSss();
        // BOOLEAN TRIGGER TOOLTIP
        dot.css('left', ($event.offsetX + 5) + 'px');
        dot.css('visibility', 'visible');
      });

      // mouseleave() Hides dot.
      elem.bind('mouseleave', function($event){
        dot.css('visibility', 'hidden');
      })

      // click(): Calculates the time to seek to based on location of progress
      // bar click. Length of bar represents the time window between start 
      // and endpoints. Updates timestamp. 
      elem.bind('click', function($event){
        pctl_debug = $event;
        var time = calculateTimeValue();
        console.log('time: ' + time.toString().toHHMMSSss());
        ctrl.API.timestamp = time;
        ctrl.API.seek(time);
      });

    };

})();

