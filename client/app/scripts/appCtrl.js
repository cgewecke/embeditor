'use strict';
var app_debug;
(function(){

angular.module('embeditor')
   .controller('AppCtrl', appCtrl )
   .directive('click', click)
   .directive('appClick', appClick);

   function appCtrl($scope, $timeout){

    var self = this;
    self.loading = true;

    $timeout(function(){
      self.loading = false;
    }, 1500);


   };
   appCtrl.$inject = ['$scope', '$timeout'];


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