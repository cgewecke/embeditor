'use strict';

/**
 * @ngdoc directive
 * @name embeditor.directive:embdSearchForm
 * @description
 * # embdSearchForm
 */
angular.module('embeditor')
  .directive('embdSearchForm', function () {
    return {
      restrict: 'E',
      template:   '\
         <form ng-controller="SearchboxCtrl as ctrl" layout="row" flex>\
         <md-button class="md-raised">\
           <md-icon md-font-icon="fa fa-youtube fa-lg">\
           </md-icon>\
         </md-button>\
         <md-autocomplete flex search-box-submit-on-return\
             placeholder="Search YouTube"\
             md-selected-item="ctrl.selectedItem"\
             md-search-text="ctrl.searchText"\
             md-search-text-change="ctrl.textChange()"\
             md-selected-item-change="ctrl.submit(ctrl.selectedItem.value)"\
             md-items="item in ctrl.getSuggestions(ctrl.searchText)"\
             md-item-text="item.value">\
             <span md-highlight-text="ctrl.searchText" ng-bind="item.value"></span>\
         </md-autocomplete>\
         <md-button class="md-raised" ng-click="ctrl.submit(ctrl.searchText)">\
           <md-icon id="spyglass" md-font-icon="fa fa-search"></md-icon>\
         </md-button>\
       </form>'      
    };
  });   
