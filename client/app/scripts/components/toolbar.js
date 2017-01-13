(function () {
  'use strict'
/**
 * Controllers for header and footer bars.
 * @component rangeFinder
 */
  angular.module('embeditor.components.toolbar', [ 'embeditor.services.layoutManager' ])
    .controller('ToolbarController', toolbarCtrl)
    .controller('FooterController', footerCtrl)

/**
 * Component controller: Manages visibility of search bar as page loads.
 * @controller toolbarCtrl
 */
  function toolbarCtrl ($scope, layoutManager, $window) {
    var vm = this
    vm.ready = false
    vm.layout = layoutManager

    /**
     * Toggles youtube search input to visible when page load is complete.
     * @param  {Event} YTPlayerAPI:ready
    */
    $scope.$on('YTPlayerAPI:ready', function () {
      vm.ready = true
    })

    /**
     * Hack to avoid dealing with the fact that the app is url based
     * on the root. And so is the landing page.
     * @method  reload
     */
    vm.reload = function () {
      $window.location.reload(true)
    }
  }
  toolbarCtrl.$inject = ['$scope', 'layoutManager', '$window']

/**
 * Component controller: Manages footer links, dialogs. (Footer is removed
 * from page as of mid-aug, 2016. Vestigial code kept here because it might return.)
 * @controller footerCtrl
 */
  function footerCtrl ($scope, $window, youtubePlayerAPI, $mdDialog) {
    var vm = this
    vm.API = youtubePlayerAPI
    
    // Dialog opener for info icon
    vm.info = function () {
      $mdDialog.show({
        clickOutsideToClose: true,
        templateUrl: 'templates/info.html',
        controller: 'FooterCtrl'
      })
    }

    // Open cyclopse-on.tumblr.com in new tab
    vm.tumblr = function () {
      $window.open('http://apocyclopse.tumblr.com', '_blank')
    }
  };
  footerCtrl.$inject = ['$scope', '$window', 'youtubePlayerAPI', '$mdDialog']

// End closure.
})()
