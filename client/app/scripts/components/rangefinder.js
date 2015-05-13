var rf_debug, rf_debugII;

(function () {
   'use strict';

   angular.module('embeditor.components.rangefinder', ['embeditor.services.youtubePlayerAPI'])

      .directive('embeditorRangefinder', rangefinder);
      
      // Element
      function rangefinder(youtubePlayerAPI){
         return {
            restrict: 'E',  
            controller: rangefinderCtrl,
            link: rangefinderInit,
            template:  '<input id="embeditor-range-finder" type="text" name="rf" value="">'
         };
      };
    
      // Link
      function rangefinderInit(scope, elem, attrs, ctrl){

         var rangeElem = elem.find('input');
         rangeElem.ionRangeSlider({
             type: "double",
             min: -1,
             max: 0, 
             from: -1,
             grid: true,
             prettify_enabled: true,
             prettify: function(val){
              return val.toString().toHHMMSS();
             },
             onChange: function(){ ctrl.change(rangeElem.prop("value").split(';'))},
             onFinish: function(){ ctrl.finish(rangeElem.prop("value").split(';'))}      
         });

         scope.API = ctrl.API;
         ctrl.slider = rangeElem.data("ionRangeSlider");

         scope.$on('YTPlayerAPI:init', function(){ ctrl.init(ctrl.API.video.seconds) });
         //scope.$on('YTPlayerAPI:load', function(){  ctrl.update(ctrl.API.startpoint.val, ctrl.API.endpoint.val)});
         scope.$on('YTPlayerAPI:change', function(){ ctrl.update(ctrl.API.startpoint.val, ctrl.API.endpoint.val)});

      };

      // Controller
      function rangefinderCtrl($scope, $timeout, youtubePlayerAPI){
         
         var self = this;
         var oldVals = {start: null, end: null}; // Track prev change values
         var changedByUpdate = false; // Track to/from updates originating outside slider
         var changedByFinish = false; // Tracks finish event, voids weird recursion w/ limit updates

         self.slider;
         self.API = youtubePlayerAPI;

         // init() Page load state (negative so we can detect it when the actual video values are loaded)
         // **************** SMART STEP *********************
         self.init = function(limit){

            var step = 5;
  
            self.slider.update({
              min: 0,
              max: limit,
              step: 5,
              from: 0,
              from_min: 0,
              from_max: limit - 1,
              to: limit,
              to_min: 1,
              to_max: limit
            })

            oldVals = {start: 0, end: length }; // Length - 1 == attempt to address play problem.
         };

         // update(): Called when 
         self.update = function(start, end){
      
            var step = 5;
            console.log("update: " + changedByFinish);
            changedByUpdate = true;


            self.slider.update({
              from: start,
              from_min: 0,
              from_max: (end - 1),
              to: end,
              to_min: (start + 1),
              to_max: self.API.video.seconds
            });

            oldVals = {start: start, end: end};

         };

         // change(): This is fired as 'to' & 'from' params change,
         // either programatically or via the handles. If rangeSlider is source of change,
         // we seek and pause allowing the user to scrub through the video.
         self.change = function(newVals){
            console.log("change: " + changedByFinish);
            var newStart = parseInt(newVals[0]);
            var newEnd = parseInt(newVals[1]);
            
            // Ignore initializations
            if (newStart < 0 || self.API.initializing) return;
            // Ignore externally initiated changes.
            if (changedByUpdate) { changedByUpdate = false; return; }

            self.API.pause();
        
            // Discover which end is scrubbing and update video
            (newStart != oldVals.start) ? self.API.seek(newStart, true) : self.API.seek(newEnd, true);

            // Advance state to present
            oldVals.start = newStart;
            oldVals.end = newEnd;
            console.log('leaving change');

         };

         // finish(): This is fired when the user releases the handle, and will result in a false call
         // to change(). New start/end point is set. 
         self.finish = function(newVals){
            
            console.log('Entering finish: ' + changedByFinish);

            // Prevent recursive call to finish by finish's own slider update.
            if (changedByFinish){ return; }

            console.log("finished: " + changedByFinish);
            var newStart = parseInt(newVals[0]);
            var newEnd = parseInt(newVals[1]);
            // Ignore initializations
            if (newStart < 0 || self.API.initializing) return;

            // Discover which end changed & update start/end point
            (newStart != self.API.startpoint.val) ? self.API.setStartpoint(newStart) : self.API.setEndpoint(newEnd);

            changedByFinish = true;

            // Update new min/max ranges for both handles.
            self.update(newStart, newEnd);

            changedByFinish = false;

            $scope.$apply();
         };
      };
      rangefinderCtrl.$inject = ['$scope', '$timeout', 'youtubePlayerAPI'];
})();








