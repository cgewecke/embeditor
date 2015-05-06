(function(){

  'use strict';

  angular.module('embeditor.components.player', ['embeditor.services.youtubePlayerAPI'])
    
    .controller('PlayerCtrl', playerCtrl );
    
    function playerCtrl(youtubePlayerAPI){
      var self = this;
      self.youtube = youtubePlayerAPI;
    };

    playerCtrl.$inject = ['youtubePlayerAPI'];

})();

