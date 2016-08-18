(function(){'use strict';
/**
 * Manages alignment of app components relative to search sidebar.
 * @service layoutManager
 */
angular.module('embeditor.services.layoutManager', ['ngMaterial'])
	.service('layoutManager', layoutManager);
	
function layoutManager($mdSidenav){

	var self = this;

	self.mobile = ( navigator.userAgent.match(/(iPad|iPhone|iPod|Android)/g) ? true : false );
	self.phone = ( navigator.userAgent.match(/(iPhone|iPod)/g) ? true : false );
	self.android = (navigator.userAgent.match(/(Android)/g) ? true : false );
	
	self.start = true;
 
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

// End closure
})();