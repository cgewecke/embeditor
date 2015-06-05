(function(){ 

  'use strict';
  angular.module('embeditor.services.cyclopseDataAPI', [])
    .factory('Videos', videos)
    .factory('Users', users);

  
  function videos($resource){
    return $resource('/api/videos/:id', {id: '@_id' });
  };

  videos.$inject = ['$resource'];

  function users($resource){

  };
  users.$inject = ['$resource'];

})();
