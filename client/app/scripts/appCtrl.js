'use strict';
var app_debug;
(function(){

angular.module('embeditor')
   .controller('AppCtrl', appCtrl )
   .directive('click', click)
   .directive('appClick', appClick)
   .directive('mobileLoadingCover', mobileLoadingCover);

   // Stub 
   function appCtrl($scope){
    var self = this;
   };
   appCtrl.$inject = ['$scope'];


   // Hide loading cover: 'player loaded' event only fired on mobileInit()
   function mobileLoadingCover(){
    return {
      restrict: 'A',  
      link: function(scope, elem, attrs){
        scope.$on('YTPlayerAPI:playerLoaded', function(){ 
          elem.css('display', 'none');
        });
      }
    };
   };

   // Substitute for ng-click(). This is an end-run around some kind of insane
   // issue w/ ng-touch where everything on iOS double clicks. 
   function click(){
      return {
         restrict: 'A',  
         link: function(scope, element, attrs){
            

            element.bind('touchstart click', function(event) {

              console.log('clicked');
            
               event.preventDefault();
               event.stopPropagation();
                
               scope.$event = event;
               scope.$apply(attrs['click']);
            });
         }
      };
   };
   

   // Top level click handler
   function appClick(layoutManager){
      return {
         restrict: 'A',  
         link: function(scope, element, attrs){
            
            element.bind('touchstart click', function(event) {
               layoutManager.start = false;
               scope.$apply();
            });
         }
      };
   };
   click.$inject = ['layoutManager'];
  
})();