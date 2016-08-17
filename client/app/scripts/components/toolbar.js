(function(){ 'use strict';
/**
 * Controllers for header and footer bars. 
 * @component rangeFinder
 */
angular.module('embeditor.components.toolbar', [ 'embeditor.services.layoutManager' ])
    .controller('ToolbarCtrl', toolbarCtrl)
    .controller('FooterCtrl', footerCtrl);

/**
 * Component controller: Manages visibility of search bar as page loads.
 * @controller toolbarCtrl
 */
function toolbarCtrl($scope, layoutManager ){

    var self = this;
    self.ready = false;
    self.layout = layoutManager;

    /**
     * Toggles youtube search input to visible when page load is complete.
     * @param  {Event} YTPlayerAPI:ready
    */
    $scope.$on('YTPlayerAPI:ready', function(){
        self.ready = true;
    });
}
toolbarCtrl.$inject = ['$scope', 'layoutManager'];

/**
 * Component controller: Manages footer links, dialogs. (Footer is removed
 * from page as of mid-aug, 2016. Vestigial code kept here because it might return.)
 * @controller footerCtrl
 */
function footerCtrl($scope, $window, youtubePlayerAPI, $mdDialog){

        var self = this;
        self.API = youtubePlayerAPI;
        $scope.mdDialog = $mdDialog;

        // Dialog opener for info icon
        self.info = function(){   
            $mdDialog.show({
                clickOutsideToClose: true,  
                templateUrl: 'templates/info.html',
                controller: 'FooterCtrl'
            });
        };

    // Open cyclopse-on.tumblr.com in new tab
    self.tumblr = function(){
        $window.open('http://apocyclopse.tumblr.com', '_blank');
    };
};
footerCtrl.$inject = ['$scope', '$window', 'youtubePlayerAPI', '$mdDialog'];

// End closure.
})();
