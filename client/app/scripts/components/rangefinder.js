(function () {
  'use strict'
/**
 * Manages a range slider widget which lets the user drag-set the start and end points of their clip and
 * provides a visual cue about the clips location relative to the rest of the video. On desktop, dragging
 * the slider ends 'fast-forward' scrubs through the video.
 * @component rangeFinder
 */
  angular.module('embeditor.components.rangefinder', ['embeditor.services.youtubePlayerAPI'])
    .directive('embeditorRangefinder', rangefinder)

// Element
  function rangefinder (youtubePlayerAPI) {
    return {
      restrict: 'E',
      controller: rangefinderCtrl,
      link: rangefinderLink,
      template: '<input id="embeditor-range-finder" type="text" name="rf" value="">'
    }
  };

/**
 * Directive link: Initializes ionRangeSlider (A JQuery widget). Sets up listeners for video loads and clip
 * start/endpoint updates so the slider reflects current editor state.
 * @method  rangefinderLink
 */
  function rangefinderLink (scope, elem, attrs, ctrl) {
    var rangeElem = elem.find('input')
    rangeElem.ionRangeSlider({
      type: 'double',
      min: 0,
      max: 1,
      from: 0,
      grid: true,
      prettify_enabled: true,
      prettify: function (val) {
        return val.toString().toHHMMSS()
      },
      onChange: function () { ctrl.change(rangeElem.prop('value').split(';')) },
      onFinish: function () { ctrl.finish(rangeElem.prop('value').split(';')) }
    })

    scope.API = ctrl.API
    ctrl.slider = rangeElem.data('ionRangeSlider')

    scope.$on('YTPlayerAPI:init', function () { ctrl.init(ctrl.API.video.seconds) })
    scope.$on('YTPlayerAPI:update', function () { ctrl.update(ctrl.API.startpoint.val, ctrl.API.endpoint.val) })
  };

/**
 * Directive controller. Implements ionRangeSlider callbacks.
 * @method  rangefinderCtrl
 */
  function rangefinderCtrl ($scope, $timeout, youtubePlayerAPI) {
    var self = this
    var oldVals = {start: null, end: null} // Track prev change values
    var changedByUpdate = false            // Track to/from updates originating outside slider

    self.slider
    self.API = youtubePlayerAPI

    /**
     * Initializes rangeSlider on page load. (Limits are negative initially so we can tell
     * when the actual video values are loaded)
     * @method  init
     * @param  {Number} limit endpoint value.
     */
    self.init = function (limit) {
      self.slider.update({
        min: 0.00,
        max: limit,
        step: 2,
        from: 0,
        from_min: 0,
        from_max: limit - 1,
        to: limit,
        to_min: 1,
        to_max: limit
      })
      oldVals = {start: 0, end: limit}
    }
    /**
     * Updates slider handle positions when start/end points are changed by an agent outside the widget.
     * @method  update
     * @param  {Number} start [description]
     * @param  {Number} end   [description]
     */
    self.update = function (start, end) {
      changedByUpdate = true

      self.slider.update({
        min: 0.00,
        max: self.API.video.seconds,
        from: start,
        from_min: 0,
        from_max: (end - 1),
        to: end,
        to_min: (start + 1),
        to_max: self.API.video.seconds
      })

      oldVals = {start: start, end: end}
    }
    /**
     * ionRangeSlider callback fired as 'to' & 'from' params change, either programatically or via
     * the handles. If rangeSlider is source of change, we seek and pause allowing the user to scrub
     * through the video.
     * @method  change
     * @param  {Array} newVals String values.
     */
    self.change = function (newVals) {
      var newStart = parseInt(newVals[0])
      var newEnd = parseInt(newVals[1])

      // Ignore initializations
      if (newStart < 0 || self.API.initializing) return
      // Ignore externally initiated changes.
      if (changedByUpdate) { changedByUpdate = false; return }

      self.API.pause()

      // Ignore self-identical repositionings.
      if (newStart === oldVals.start && newEnd === oldVals.end) return

      // Discover which end is scrubbing and seek to new tapehead pos.
      if (newStart !== oldVals.start) {
        self.API.mobile ? self.API.seek_mobile(newStart) : self.API.seek(newStart)
      } else {
        self.API.mobile ? self.API.seek_mobile(newEnd) : self.API.seek(newEnd)
      }

      // Advance state to present
      oldVals.start = newStart
      oldVals.end = newEnd
      self.changed = true
    }
    /**
     * ionRangeSlider callback fired when user release a handle. Sets new start/end point.
     * @method  finish
     * @param  {Array} newVals String values.
     */
    self.finish = function (newVals) {
      var newStart = parseFloat(newVals[0])
      var newEnd = parseFloat(newVals[1])
      var oldStart = Math.round(self.API.startpoint.val)
      var oldEnd = Math.round(self.API.endpoint.val)

      // Ignore initializations
      if (newStart < 0 || self.API.initializing) return

      self.API.pause()

      // Ignore self-identical repositionings.
      if (newStart === oldStart && newEnd === oldEnd) return

      // Discover which end changed & update start/end point
      if (newStart !== Math.round(self.API.startpoint.val)) {
        self.API.setStartpoint(newStart)
        self.API.start(0)
      } else {
        self.API.setEndpoint(newEnd)
        self.API.end(0)
      }
      $scope.$apply()
    }
  };
  rangefinderCtrl.$inject = ['$scope', '$timeout', 'youtubePlayerAPI']
})()

