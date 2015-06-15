(function(){ 

  'use strict';
  angular.module('embeditor.services.layoutManager', ['ngMaterial'])
    .service('layoutManager', layoutManager);

  
  function layoutManager($mdSidenav){
  
    tb_debug = $mdSidenav;
    var self = this;

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

})();