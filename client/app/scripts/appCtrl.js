'use strict';
var app_debug;
(function(){

angular.module('embeditor')
   .controller('AppCtrl', appCtrl )
   .directive('click', click);

   function appCtrl($scope, $timeout){

    var self = this;
    self.loading = true;

    $timeout(function(){
      self.loading = false;
    }, 1500);


   };
   appCtrl.$inject = ['$scope', '$timeout'];


   function click(){
      return {
         restrict: 'A',  
         link: function(scope, element, attrs){
            
            element.bind('touchstart click', function(event) {
               
               event.preventDefault();
               event.stopPropagation();
                
               scope.$event = event;
               scope.$apply(attrs['click']);
            });
         }
      };
   };
  
})();