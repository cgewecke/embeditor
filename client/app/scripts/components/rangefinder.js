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
         scope.$on('YTPlayerAPI:update', function(){ ctrl.update(ctrl.API.startpoint.val, ctrl.API.endpoint.val)});

      };

      // Controller
      function rangefinderCtrl($scope, $timeout, youtubePlayerAPI){
         
         var self = this;
         var oldVals = {start: null, end: null}; // Track prev change values
         var changedByUpdate = false; // Track to/from updates originating outside slider
         
         self.slider;
         self.API = youtubePlayerAPI;

         // init() Page load state (negative so we can detect it when the actual video values are loaded)
         // **************** SMART STEP *********************
         self.init = function(limit){

            var step = 5;
  
            self.slider.update({
              min: 0.00,
              max: limit,
              step: 5,
              from: 0,
              from_min: 0,
              from_max: limit - 1,
              to: limit,
              to_min: 1,
              to_max: limit
            })

            oldVals = {start: 0, end: length }; 
         };

         // update(): Called when 
         self.update = function(start, end){
            console.log("update");
            var step = 5;
  
            changedByUpdate = true;
      
            self.slider.update({
              min: 0.00,
              max: self.API.video.seconds,
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
            console.log("change");
            var newStart = parseInt(newVals[0]);
            var newEnd = parseInt(newVals[1]);
            
            // Ignore initializations
            if (newStart < 0 || self.API.initializing) return;
            // Ignore externally initiated changes.
            if (changedByUpdate) { changedByUpdate = false; return; }

            self.API.pause();
        
            // Discover which end is scrubbing and seek to new tapehead pos.
            if (newStart != oldVals.start){
              self.API.seek(newStart, true)
            } else {
              self.API.seek(newEnd, true);
            }
            
            // Advance state to present
            oldVals.start = newStart;
            oldVals.end = newEnd;
            self.changed = true;
         };

         // finish(): New start/end point is set. This is fired when the user 
         // releases the handle. 
         self.finish = function(newVals){
            console.log("finish");
            var newStart = parseFloat(newVals[0]);
            var newEnd = parseFloat(newVals[1]);

             // Ignore initializations
            if ( newStart < 0 || self.API.initializing) return;

            self.API.pause();

            // Discover which end changed & update start/end point
            if(newStart != Math.round(self.API.startpoint.val)){
              self.API.start(newStart);
            } else{
              self.API.end(newEnd);
            } 

            $scope.$apply();
         };
      };
      rangefinderCtrl.$inject = ['$scope', '$timeout', 'youtubePlayerAPI'];
})();


/* // finish(): This is fired when the user releases the handle, and will result in a false call
         // to change(). New start/end point is set. 
         self.finish = function(newVals){
            
            var newStart = parseFloat(newVals[0]);
            var newEnd = parseFloat(newVals[1]);

            // Ignore recusive calls & initializations
            if (changedByFinish || newStart < 0 || self.API.initializing) return;

            self.API.pause();

            // Discover which end changed & update start/end point
            if(newStart != Math.round(self.API.startpoint.val)){
              self.API.setStartpoint(newStart);
              self.API.seek(newStart, true); // Make sure we sought.
              self.API.timestamp = newStart;
            } else{
              self.API.setEndpoint(newEnd);
              self.API.seek(newEnd, true); // Make sure we sought.
              self.API.timestamp = newEnd;

            } 

            // Update new min/max ranges for both handles, handle recursion
            changedByFinish = true; 
            self.update(newStart, newEnd);
            changedByFinish = false;
        
            $scope.$apply();
         };*/





