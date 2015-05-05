'use strict';

/**
 * @ngdoc service
 * @name embeditor.ui
 * @description
 * # ui 
 * # allows different components of the page to synch behavior,
 * # defines key constants.
 * Service in the embeditor.
 */
angular.module('embeditor')
  .service('$ui', function ($rootScope) {

   var self = this;

   self.synch = {
      searchText: ''
   };

   $rootScope.$watch('self.synch.searchText', function(newVal, oldval){
         console.log('searchText changed: ' + newVal);
   });

   self.KEY_CODES = {
      ESCAPE: 27,
      RETURN: 13
   };

  });
