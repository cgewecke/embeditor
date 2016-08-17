(function(){ 'use strict';
/**
 * Controller and directives for a search results sidebar that gives user access to some
 * basic youtube search filters and lets them select a video to edit. 
 * @component searchsidebar
 */
angular.module('embeditor.components.searchsidebar', [

        'embeditor.services.layoutManager',
        'embeditor.services.youTubeDataAPI', 
        'embeditor.services.youtubePlayerAPI'
    ])
    .controller('SearchSidebarCtrl', SearchSidebarCtrl)
    .directive('embeditorSectionSidebar', embeditorSectionSidebar)
    .directive('embeditorSearchHistoryOption', embeditorSearchHistoryOption)
    .directive('embeditorSearchItem', embeditorSearchItem )

/**
 * Component controller. Exposes app services and manages sidebar opening/closing.
 * @method  SearchSidebarCtrl 
 */
function SearchSidebarCtrl($scope, youTubeDataAPI, layoutManager, $mdSidenav) {
 
    var self = this;
    
    self.youTube = youTubeDataAPI;
    self.layout = layoutManager
    self.mdSidenav = $mdSidenav; 

    self.isOpen = false; 
    self.showSearchBox = true; 

    /**
     * Listens for the query submission event. Toggles sidebar open if closed.
     * Boolean isOpen stops results from attempting to render before sidebar is open.
     * @param  {Event} youTubeDataAPI:query
     */
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
SearchSidebarCtrl.$inject = ['$scope', 'youTubeDataAPI', 'layoutManager', '$mdSidenav'];

/**
 * Located on each option of the history select. This helps the select work
 * like a menu with links. We need the history fetch to occur regardless of
 * whether it was the last history selection made, because many other searches could
 * have been run in the interim.
 * @directive embeditorSearchHistoryOption 
 */
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

/**
 * Handles search item click event and toggles sidebar closed on mobile.
 * @directive embeditorSearchHistoryOption 
 */
function embeditorSearchItem(youTubeDataAPI, youtubePlayerAPI, $mdSidenav){
    return{
        restrict: 'E',
        scope: { video: '=video' },
        link: searchItemEventHandlers,
        templateUrl: 'templates/searchitem.html'
    };

    function searchItemEventHandlers(scope, elem, attrs){

        scope.dataAPI = youTubeDataAPI;
        scope.playerAPI = youtubePlayerAPI;

        // Clicks on the play icon
        scope.play = function(video){
            
            // Auto close sidenav on iphone, ipod & android
            // Event Broadcast is listened for by search box for phone (bug hack);
            (scope.playerAPI.phone) ?
                $mdSidenav('search').toggle() :
                false;
        
            scope.playerAPI.load(video);
        }
    };
};
embeditorSearchItem.$inject = ['youTubeDataAPI', 'youtubePlayerAPI', '$mdSidenav'];


// ---------------------------- Unit Testing ---------------------------------------
function embeditorSectionSidebar(){ return{ templateUrl: 'templates/sidebar.html' }};


// End Closure.
})();
            