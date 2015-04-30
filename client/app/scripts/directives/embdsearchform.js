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
         <md-autocomplete flex search-box-submit-on-return\
             placeholder="Search YouTube"\
             md-selected-item="selectedItem"\
             md-search-text="searchText"\
             md-search-text-change="ctrl.textChange()"\
             md-selected-item-change="ctrl.submit(selectedItem.value)"\
             md-items="item in ctrl.getSuggestions(searchText)"\
             md-item-text="item.value">\
             <span md-highlight-text="ctrl.searchText" ng-bind="item.value"></span>\
         </md-autocomplete>\
         <md-button class="md-raised" ng-click="ctrl.submit(searchText)">\
           <md-icon id="spyglass" md-font-icon="fa fa-search"></md-icon>\
         </md-button>\
       </form>'      
    };
  });   
/*
<md-button class="md-raised">\
           <md-icon md-font-icon="fa fa-youtube fa-lg">\
           </md-icon>\
         </md-button>\ */