'use strict';

var sb_debug, sb_debugII, sb_debugIII;
/**
 * @ngdoc function
 * @name embeditor.controller:SearchSidebarCtrl
 * @description
 * # SearchSidebarCtrl
 * Controller of the embeditor
 */

(function(){

  'use strict';

  angular.module('embeditor.components.searchsidebar', ['embeditor.services.youTubeDataAPI', 'embeditor.services.youtubePlayerAPI'])
    
    .controller('SearchSidebarCtrl', searchSidebarCtrl)
    .directive('embeditorSearchHistoryOption', searchHistoryOption)
    .directive('embeditorSearchPlayVideo', searchPlayVideo )
    .directive('embeditorSearchThumbnailChecker', searchThumbnailChecker);

    // Controller for the sidebar. Makes youtube api visible on scope and
    // toggles sidebar open when a query is made from toolbar.
    function searchSidebarCtrl($scope, youTubeDataAPI, $mdSidenav) {
     
      var self = this;
      self.youTube = youTubeDataAPI;
      self.mdSidenav = $mdSidenav; 

      // Toggles sidebar open if closed
      $scope.$on('youTubeDataAPI:query', function(event, msg){
        if (!self.mdSidenav('search').isOpen()){
          self.mdSidenav.exists = true; // exception issues for toolbar.js
          self.mdSidenav('search').toggle();
        }
      });
    };
    searchSidebarCtrl.$inject = ['$scope', 'youTubeDataAPI', '$mdSidenav'];

    // Located on each option of the history select. This helps the select work
    // like a menu with links. We need the history fetch to occur regardless of
    // whether it was the last history selection made, because many other searches could
    // have been run in the interim. 
    function searchHistoryOption(youTubeDataAPI){
      return {
        restrict: 'A',
        link: submitEventHandlers
      };
      function submitEventHandlers(scope, elem, attrs){
            
        elem.bind('click', function(event){
           youTubeDataAPI.getAgain(scope.previous);
        });

        elem.bind('keydown', function(event){
           if (event.which == '13'){
              youTubeDataAPI.getAgain(scope.previous);
           };
        });
      };
    };
    searchHistoryOption.$inject = ['youTubeDataAPI'];

    // Located on the play button - click closes the sidebar and
    // loads the search result into the player
    function searchPlayVideo(youtubePlayerAPI, $mdSidenav){
      return{
        restrict: 'A',
        link: clickEventHandler
      };
      function clickEventHandler(scope, elem, attrs){
        elem.bind('click', function(event){
          $mdSidenav('search').toggle();
          youtubePlayerAPI.load(scope.video.videoId);
        });
      }
    }
    searchPlayVideo.$inject = ['youtubePlayerAPI', '$mdSidenav'];

    // Not implemented. In chrome, a 404 event when the thumbnail 
    // link is broken, but it never triggers the 'error' event. Youtube
    // also sends a small 1mb default image that rarely loads. Firefox
    // successfully loads this image.
    function searchThumbnailChecker($http){
      return {
        restrict: 'A',
        link: loadErrorEventHandler
      };
      function loadErrorEventHandler(scope, elem, attrs){
      };
    };
    searchThumbnailChecker.$inject = ['$http'];

})();
        

