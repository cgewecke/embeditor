(function(){ 

  'use strict';
  angular.module('embeditor.services.layoutManager', ['ngMaterial'])
    .service('layoutManager', layoutManager)
    .controller('LayoutController', layoutController)

  
  function layoutManager($mdSidenav){
  
    var self = this;

    self.mobile = ( navigator.userAgent.match(/(iPad|iPhone|iPod|Android)/g) ? true : false );
    self.phone = ( navigator.userAgent.match(/(iPhone|iPod)/g) ? true : false );
    self.start = true;
    
    // sidenavIsOpen(id) Boolean toggle used for show/hide layout elements when
    // a sidebar is open. 
    self.sidenavIsOpen = function(id){ 
      if ($mdSidenav.exists && $mdSidenav(id).isOpen()){
         return true;
      } else {
         return false; 
      }    
    };

    // alignWithSidenav(id, type, alignment) where id is the 
    // nav id, type is 'row || column' and alignment is the 
    // default alignment for the component. When sidenav opens
    // fn will make components right-centered, when closed will
    // restore to default alignment
    self.alignWithSidenav = function(id, type, alignment){ 
      
      // Default alignment is centered
      (!alignment) ?
        alignment = 'center center':
        false;

      // Sidenav open alignment is right-center aligned
      if ($mdSidenav.exists && $mdSidenav(id).isOpen()){
        (type === 'row') ? 
          alignment = 'end center': 
          alignment = 'center end';
      } 
      return alignment;
    };
  }
  layoutManager.$inject = ['$mdSidenav'];

  function layoutController(layoutManager){

  }

})();