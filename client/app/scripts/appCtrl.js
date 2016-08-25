'use strict';
var app_debug;
(function(){

angular.module('embeditor')
	.controller('AppCtrl', appCtrl )
	.directive('click', click)
	.directive('appClick', appClick)
	.directive('mobileLoadingCover', mobileLoadingCover);

	// Stub 
	function appCtrl($scope, layoutManager){
		var self = this;
		self.layout = layoutManager;
	 
	};
	appCtrl.$inject = ['$scope', 'layoutManager'];


	// Hides loading cover: 'player loaded' event fired on init() & mobileInit()
	// Android: Currently problems so severe that we just leave cover on.
	function mobileLoadingCover($timeout){
		return {
			restrict: 'A',
			controller: 'AppCtrl',  
			link: function(scope, elem, attrs, app){

				var wait = true;

				// Show cover min 1 sec then fade in
				$timeout(function(){ 
					if (!wait) {
						elem.animate({ opacity: 0 }, 700);
					}
				}, 1000);

				scope.$on('YTPlayerAPI:playerLoaded', function(){
					elem.animate({ opacity: 0 }, 700);
					wait = false;
				});
			}
		};
	};
	mobileLoadingCover.$inject = ['$timeout'];

	// Substitute for ng-click(). This is an end-run around some kind of insane
	// issue w/ ng-touch where everything on iOS double clicks. 
	function click(layoutManager){
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
	click.$inject = ['layoutManager'];
	 
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
	appClick.$inject = ['layoutManager'];
	
})();