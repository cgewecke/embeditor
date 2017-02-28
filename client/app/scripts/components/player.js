(function () {
  'use strict';
  /**
   * Manages the quickset buttons and the progress bar/time-seeker under the embedded editor player.
   * Also houses watchers for control settings like loop and playback speed that require updates
   * to the embed code generator.
   * @component player
   */
  angular.module('embeditor.components.player', [
    'ngMaterial',
    'embeditor.components.embedcodedialog',
    'embeditor.services.youtubePlayerAPI',
    'embeditor.services.codeGenerator',
    'embeditor.services.layoutManager'
  ])
    .controller('PlayerController', playerCtrl)
    .directive('embeditorPlayerTimeBar', embeditorPlayerTimeBar)
    .directive('embeditorSectionPlayerControls', embeditorSectionPlayerControls)
    .directive('embeditorSectionApp', embeditorSectionApp)

  // ----------------------------------  Controller ------------------------------------------------------
  function playerCtrl ($scope, codeGenerator, youtubePlayerAPI, $mdSidenav, embedCodeDialog, layoutManager) {
    var self = this

    self.API = youtubePlayerAPI
    self.dialog = embedCodeDialog
    self.code = codeGenerator
    self.layout = layoutManager

    /**
     * Sets new start point at the current tapehead pos. Proximity warning
     * about minimum clip size is disabled for this call.
     * @method  startFromTimestamp
     */
    self.startFromTimestamp = function () {
      if (self.API.initializing) return

      self.API.setStartpoint(self.API.timestamp)
      self.API.start(0, true)
    }
    /**
     * Sets new end point at the current tapehead pos. Proximity warning
     * about minimum clip size is disabled for this call.
     * @method  startFromTimestamp
     */
    self.endFromTimestamp = function () {
      if (self.API.initializing) return

      self.API.setEndpoint(self.API.timestamp)
      self.API.end(0, true)
    }

    // ------------------------------ Variable Watches -----------------------------------------
    /**
     * Watches "currentRate" and updates player behavior and the code generator.
     * @param  {Number} currentRate   Playback speed setting
     */
    $scope.$watch('API.currentRate', function (newval, oldval) {
      if (self.API.videoLoaded) {
        self.API.setRate(newval)
        self.code.set('rate', newval)
      }
    })
    /**
     * Watches "loop" and updates the code generator options.
     * @param  {Boolean} loop   Loop or not loop.
     */
    $scope.$watch('API.loop', function (newval, oldval) {
      self.code.set('loop', newval)
    })

    /**
     * Watches "mute" and updates player behavior and the code generator.
     * @param  {Boolean} mute   Silence or noise
     */
    $scope.$watch('API.mute', function (newval, oldval) {
      if (self.API.videoLoaded && newval !== angular.isUndefined) {
        (newval)
          ? self.API.silence()
          : self.API.noise();

        self.code.set('mute', newval)
      };
    })

    // ------------------------------ Event Listeners ------------------------------------------
    /**
     * Listens for video load (on page load and on video selection in the search sidebar).
     * Updates code generator options and settings.
     * @param {Event} YTPlayerAPI:init
     */
    $scope.$on('YTPlayerAPI:init', function () {
      self.code.set('videoId', self.API.video.videoId)
      self.code.set('title', self.API.video.title)
      self.code.set('imageUrl', self.API.video.imageUrl)
    })
    /**
     * Listens for updates to changes in clip's startpoint and endpoint
     * Updates code generator options and settings.
     * @param {Event} 'YTPlayerAPI:set'
     */
    $scope.$on('YTPlayerAPI:set', function (event, msg) {
      self.code.set(msg.type, msg.value)
    })
  };

  playerCtrl.$inject = ['$scope', 'codeGenerator', 'youtubePlayerAPI', '$mdSidenav', 'embedCodeDialog', 'layoutManager'];

  // ---------------------------------- Directives ------------------------------------------------
  /**
   * Tapehead animation and click-seek widget.
   * @directive embeditorPlayerTimeBar
   */
  function embeditorPlayerTimeBar () {
    return {
      restrict: 'E',
      link: timeBarEventHandlers,
      controller: playerCtrl,
      templateUrl: 'templates/timebar.html'
    }
  };

  function timeBarEventHandlers (scope, elem, attr, ctrl) {
    // Elements
    var dot = elem.find('ng-md-icon')
    var tapehead = elem.find('span.tapehead-animation-wrapper')
    var value = elem.find('span.progress-bar-time')
    var bar = elem.find('md-progress-linear')

    // Boundary values
    var lowLimit = 20 // pixel . . .
    var highLimit = bar.width() - 10
    var xCoord = 0

    // Scope
    scope.showDot = false
    scope.timestamp = ctrl.API.timestamp
    scope.time = (0).toString().toHHMMSSss()
    scope.API = ctrl.API

    // Unit test patch
    if (highLimit <= 0) {
      highLimit = 854
      bar.width(854)
    }

    // ------------------------------- Time Dot Animation ------------------------------
    /**
     * Translates space (click) to time (seek position).
     * @method calculateTimeDotValue
     * @return {Number} Time to seek to.
     */
    function calculateTimeDotValue () {
      var ratio = (xCoord / bar.width())
      var time = (ctrl.API.endpoint.val - ctrl.API.startpoint.val) * ratio
      return ctrl.API.startpoint.val + time
    };
    /**
     * Shows dot/time value mapped by location the cursor hovers over. Fired on mousemove.
     * @method  updateTimeDot
     * @param  {Event} $event  mousemove
     */
    scope.updateTimeDot = function ($event) {
      xCoord = $event.offsetX === angular.isUndefined ? $event.originalEvent.layerX : $event.offsetX;

      var offset = elem.offset()
      var dotXPos = (xCoord + 5) + 'px'
      var valueXPos = (offset.left + xCoord - 10) + 'px'
      var valueYPos = (offset.top - 35) + 'px'

      // Ignore false offset values that occur when mouse
      // suddenly moves over dot && stop from running off end.
      if (xCoord > lowLimit && xCoord < highLimit) {
        scope.time = calculateTimeDotValue().toString().toHHMMSSss()
        dot.css('left', dotXPos)
        dot.css('visibility', 'visible')
        value.css('left', valueXPos)
        value.css('top', valueYPos)
        value.css('visibility', 'visible')
      } else {
        scope.hideTimeDot()
      }
    }
    /**
     * Hides timedot. Fired on mouseleave
     * @method  hideTimeDot
     */
    scope.hideTimeDot = function () {
      dot.css('visibility', 'hidden')
      value.css('visibility', 'hidden')
    }
    /**
     * Seeks video to location specified by click.
     * @method  seekVideoToTimeDot
     */
    scope.seekVideoToTimeDot = function () {
      // Desktop: don't go outside bounds
      if (xCoord > lowLimit && xCoord < highLimit) {
        var time = calculateTimeDotValue()
        ctrl.API.setTapehead(time)
      }
    }
    /**
     * Seeks video to location specified by touch.
     * @method  seekVideoToTouch
     * @param {Event} $event touchstart
     */
    scope.seekVideoToTouch = function ($event) {
      var time
      if (scope.API.initializing) return;

      (ctrl.layout.android)
        ? xCoord = Math.floor($event.originalEvent.touches[0].clientX)
        : xCoord = ($event.offsetX === angular.isUndefined) ? $event.originalEvent.layerX : $event.offsetX;

      time = calculateTimeDotValue()
      ctrl.API.setTapehead(time)
    }

    // ----------------   Tapehead Animation -----------------------------

    /**
     * Watches changes in player time and updates tapehead animation
     * @param  {Number} timestamp   Floating point seconds
     */
    scope.$watch('API.timestamp', function (newval, oldval) {
      (newval) ? updateTapehead() : false;
    })
    /**
     * Listens for start/end val updates. The timeline gets rebased then.
     * @param  {Event} YTPlayerAPI:update
     */
    scope.$on('YTPlayerAPI:update', function (newval, oldval) {
      (newval) ? updateTapehead() : false;
    })
    /**
     * Translates current tapehead pos to timebar space.
     * @method  updateTapehead
     */
    function updateTapehead () {
      var clipDuration, ratio, newPosition

      var playerWidth = bar.width()
      var timestampWidth = 14 // Pixel - bullshit

      clipDuration = (ctrl.API.endpoint.val - ctrl.API.startpoint.val)
      ratio = (ctrl.API.timestamp - ctrl.API.startpoint.val) / clipDuration
      newPosition = Math.floor(bar.width() * ratio);

        // Either update or detect end and stop for the last few pixels
      (newPosition < (playerWidth - timestampWidth))
        ? tapehead.css('left', newPosition)
        : tapehead.css('left', (playerWidth - timestampWidth));
    };
  };
  // ---------------------------------- Unit Testing ------------------------------------------------------
  function embeditorSectionPlayerControls () {
    return { templateUrl: 'templates/playercontrols.html' }
  };

  function embeditorSectionApp () {
    return { templateUrl: 'templates/player.html' }
  };
})();

