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
  .service('$ui', function () {

   var self = this;

   self.KEY_CODES = {
      ESCAPE: 27,
      RETURN: 13
   };


    
  });
