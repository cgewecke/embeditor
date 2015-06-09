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
    
    .controller('SearchSidebarCtrl', SearchSidebarCtrl)
    .directive('embeditorSectionSidebar', embeditorSectionSidebar)
    .directive('embeditorSearchHistoryOption', embeditorSearchHistoryOption)
    .directive('embeditorSearchItem', embeditorSearchItem )

    // <embeditor-section-sidebar></embeditor-section-sidebar>
    // Outer tag for entire sidebar so we can pull it in for unit testing.
    function embeditorSectionSidebar(){ return{ templateUrl: 'templates/sidebar.html' }};

    // Controller for the sidebar. Makes youtube api visible on scope and
    // toggles sidebar open when a query is made from toolbar.
    function SearchSidebarCtrl($scope, youTubeDataAPI, $mdSidenav) {
     
      var self = this;
      self.youTube = youTubeDataAPI;
      self.mdSidenav = $mdSidenav; 
      self.isOpen = false; 

      // Toggles sidebar open if closed. 
      // isOpen stops results from attempting to render before sidebar is open. 
      $scope.$on('youTubeDataAPI:query', function(event, msg){
        if (!self.mdSidenav('search').isOpen()){
          self.mdSidenav.exists = true; // exception issues for toolbar.js
          self.isOpen = false;
          self.mdSidenav('search').toggle().then(function(){ 
            self.isOpen = true;
          });
        }
      });
    };
    SearchSidebarCtrl.$inject = ['$scope', 'youTubeDataAPI', '$mdSidenav'];

    // Located on each option of the history select. This helps the select work
    // like a menu with links. We need the history fetch to occur regardless of
    // whether it was the last history selection made, because many other searches could
    // have been run in the interim. 
    function embeditorSearchHistoryOption(youTubeDataAPI){
      return {
        restrict: 'A',
        link: historyOptionEventHandlers
      };
      function historyOptionEventHandlers(scope, elem, attrs){
            
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
    embeditorSearchHistoryOption.$inject = ['youTubeDataAPI'];

    // <embeditor-search-item></embeditor-search-item>
    function embeditorSearchItem(youTubeDataAPI, youtubePlayerAPI, $mdSidenav){
      return{
        restrict: 'E',
        scope: { video: '=video' },
        link: searchItemEventHandlers,
        templateUrl: 'templates/searchitem.html'
      };

      function searchItemEventHandlers(scope, elem, attrs){

        var dataAPI = youTubeDataAPI;
        var playerAPI = youtubePlayerAPI
        var thumbnailElem = angular.element(elem.find('div')[1]);
        var channelElem = angular.element(elem.find('div')[3]);
        var relatedElem = elem.find('button');

        // Play Video click
        thumbnailElem.bind('click', function(event){
          console.log("video: " + scope.video.seconds);
          playerAPI.load(scope.video);
        });

        // Search Related Videos click
        relatedElem.bind('click', function(event){
          dataAPI.getRelatedVideos(scope.video); 
          event.stopPropagation();
        });

        // Search Channel Videos click
        channelElem.bind('click', function(event){
          dataAPI.getChannelVideos(scope.video);
        });
      };
    };
    embeditorSearchItem.$inject = ['youTubeDataAPI', 'youtubePlayerAPI', '$mdSidenav'];

    

})();
      