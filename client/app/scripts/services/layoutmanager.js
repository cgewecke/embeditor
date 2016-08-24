var lm_debug, lm_debugII;

(function(){'use strict';
/**
 * Manages alignment of app components relative to search sidebar.
 * @service layoutManager
 */
angular.module('embeditor.services.layoutManager', ['ngMaterial'])
	.service('layoutManager', layoutManager)
	.directive('layoutHeightManager', layoutHeightManager)
	.directive('layoutVerticalFill', layoutVerticalFill);
	
function layoutManager($mdSidenav){

	var self = this;

	self.mobile = ( navigator.userAgent.match(/(iPad|iPhone|iPod|Android)/g) ? true : false );
	self.phone = ( navigator.userAgent.match(/(iPhone|iPod)/g) ? true : false );
	self.android = (navigator.userAgent.match(/(Android)/g) ? true : false );
	
	self.start = true;
	self.bottomFill = 0;
 
	/**
	 * Boolean toggle to show/hide layout elements when sidebar is open.
	 * @method  sidenavIsOpen 
	 * @param  {String} id $md-sideNave id.
	 * @return {Boolean}   
	 */
	self.sidenavIsOpen = function(id){ 
		return ($mdSidenav.exists && $mdSidenav(id).isOpen());
	};
	/**
	 * Makes components right-centered when sidenav opens and restores
	 * them to their default alignement when it closes.
	 * @method  alignWithSidenav 
	 * @param  {String} id        $md-sideNave id.
	 * @param  {String} type      row OR column
	 * @param  {String} alignment default type for a given component
	 * @return {String}           required alignement
	 */
	self.alignWithSidenav = function(id, type, alignment){ 
		
		// Default alignment is centered
		(!alignment) 
			? alignment = 'center center'
			: false;

		// Sidenav open alignment is right-center aligned
		if ($mdSidenav.exists && $mdSidenav(id).isOpen()){
			(type === 'row') 
				? alignment = 'end center' 
				: alignment = 'center end';
		} 
		return alignment;
	};
}
layoutManager.$inject = ['$mdSidenav'];

/**
 * Calculates height of the player controls if screen height is greater than app height
 * @directive bottomSpacer: (attribute) 
 */
function layoutHeightManager($rootScope, $window, layoutManager){
    return {
        restrict: 'A',  
        link: function(scope, elem, attrs){
        	scope.window = $window;

        	// Wait until player has loaded - otherwise app height is incorrect.
        	$rootScope.$on('YTPlayerAPI:playerLoaded', function(){
        		
        		scope.$watch('window.innerHeight', function(newVal, oldVal){
	        		if (newVal != undefined && elem.height() < newVal ){
	        			layoutManager.bottomFill = newVal - elem.height();
	        		} 
	        	});
        	});
        }
    };
};
layoutHeightManager.$inject = ['$rootScope', '$window', 'layoutManager'];

/**
 * Dynamically sets height of a spacer if screen height is greater than app height
 * @directive layoutVerticalFill: (attribute) 
 */
function layoutVerticalFill(layoutManager){
    return {
        restrict: 'A',  
        link: function(scope, elem, attrs){
        	scope.layout = layoutManager;
        	scope.$watch('layout.bottomFill', function(newVal, oldVal){
        		(newVal != undefined && scope.layout.bottomFill)
        			? elem.height(newVal)
        			: null
        	});
        }
    };
};
layoutVerticalFill.$inject = ['layoutManager'];

// End closure
})();