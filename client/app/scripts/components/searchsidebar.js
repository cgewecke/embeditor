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
    .directive('embeditorSearchHistoryOption', embeditorSearchHistoryOption)
    .directive('embeditorSearchItem', embeditorSearchItem )

    // Controller for the sidebar. Makes youtube api visible on scope and
    // toggles sidebar open when a query is made from toolbar.
    function SearchSidebarCtrl($scope, youTubeDataAPI, $mdSidenav) {
     
      var self = this;
      self.youTube = youTubeDataAPI;
      self.mdSidenav = $mdSidenav; 

      // Toggles sidebar open if closed
      $scope.$on('youTubeDataAPI:query', function(event, msg){
        console.log('heard query at sidebar');
        if (!self.mdSidenav('search').isOpen()){
          console.log('entered condition at sidebar');
          self.mdSidenav.exists = true; // exception issues for toolbar.js
          self.mdSidenav('search').toggle();
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
        template: '\
          <div class="searchItems">\
            <span class="searchItemDuration">{{video.duration}}</span>\
            <span class="searchItemPublishedAt">{{video.publishedAt}}</span>\
            <div class="searchItemClickArea"\
                 ng-init="hover=false"\
                 ng-mouseenter="hover=true"\
                 ng-mouseleave="hover=false">\
                 <span class="fa fa-play-circle fa-3x searchPlayIcon"\
                       ng-show="hover"></span>\
                 <md-button\
                    aria-label="related"\
                    class="searchRelatedIcon"\
                    ng-show="hover"\
                    ng-click="search.youTube.getRelatedVideos(video); $event.stopPropagation()">\
                    <md-tooltip\
                      class="searchRelatedTooltip searchRelatedText"\
                      md-direction="left">\
                      <span class="searchRelatedText"> Related </span> \
                    </md-tooltip>\
                    <md-icon md-font-icon="fa fa-sitemap"></md-icon>\
                </md-button>\
                <img class="searchThumbnail"\
                     ng-src="{{video.imageUrl}}">\
            </div>\
            <div class="searchItemTitleContainer">{{video.title}}</div>\
            <div class="searchItemChannelContainer"> by {{video.channelTitle}}</div>\
          </div>'
      };

      function searchItemEventHandlers(scope, elem, attrs){

        var dataAPI = youTubeDataAPI;
        var playerAPI = youtubePlayerAPI
        var thumbnailElem = angular.element(elem.find('div')[1]);
        var channelElem = angular.element(elem.find('div')[3]);
        var relatedElem = elem.find('button');

        // Play Video click
        thumbnailElem.bind('click', function(event){
          //$mdSidenav('search').toggle();
          console.log("video: " + scope.video.videoId);
          playerAPI.load({videoId: scope.video.videoId});
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
      