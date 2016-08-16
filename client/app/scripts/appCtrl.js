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


	// Hide loading cover: 'player loaded' event only fired on mobileInit()
	// Android: Currently problems so severe that we just leave cover on.
	function mobileLoadingCover(){
		return {
			restrict: 'A',
			controller: 'AppCtrl',  
			link: function(scope, elem, attrs, app){
				scope.$on('YTPlayerAPI:playerLoaded', function(){
					elem.css('display', 'none');
				});
			}
		};
	};

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