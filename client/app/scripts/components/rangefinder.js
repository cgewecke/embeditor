(function () {
   'use strict';

   angular.module('embeditor.components.rangefinder', ['embeditor.services.youtubePlayerAPI'])

      .directive('embeditorRangefinder', rangefinder);
      
      // Element
      function rangefinder(){
         return {
            restrict: 'E',  
            controller: rangefinderCtrl,
            link: rangefinderInit,
            template:  '<input id="embeditor-range-finder" type="text" name="rf" value="">'
         };
      };
      rangefinder.$inject = ['youtubePlayerAPI'];

      // Link
      function rangefinderInit(scope, elem, attrs, rfCtrl){

         scope.rfCtrl = rfCtrl
         var rf = elem.find('input');
         rf.ionRangeSlider({
             type: "double",
             min: 0,
             max: 1000,
             from: 200,
             to: 500,
             grid: true
         });
   
         rfCtrl.slider = rf.data("ionRangeSlider");

      };

      // Controller
      function rangefinderCtrl(){
         this.slider = null;
      };

})();