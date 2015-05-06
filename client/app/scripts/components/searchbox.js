var sr_debug, sr_debugII;
/**
 * @ngdoc function
 * @name embeditor.controller:SearchboxCtrl
 * @description
 * # SearchboxCtrl
 * Controller of the embeditor: 
 */

(function () {
   'use strict';

   angular.module('embeditor.components.searchbox', ['embeditor.services.youTubeDataAPI'])

      .directive('embeditorSearchbox', searchbox);
      
   // Element
   function searchbox(){
      return {
         restrict: 'E',
         template:  '\
         <form layout="row" flex>\
            <md-autocomplete flex\
                placeholder="Search YouTube"\
                md-selected-item="selectedItem"\
                md-search-text="searchText"\
                md-search-text-change="ctrl.textChange()"\
                md-selected-item-change="ctrl.submit(selectedItem.value)"\
                md-items="item in ctrl.getSuggestions(searchText)"\
                md-item-text="item.value">\
                <span md-highlight-text="searchText" ng-bind="item.value"></span>\
            </md-autocomplete>\
            <md-button id="spyglass" aria-label="search" class="md-raised" ng-click="ctrl.submit(searchText)">\
              <md-icon md-font-icon="fa fa-search"></md-icon>\
            </md-button>\
         </form>',    
         controller: searchboxCtrl,
         link: searchboxEventHandlers
      };
   };

   // Controller
   function searchboxCtrl($scope, $resource, youTubeDataAPI) {

      var self = this;

      // Google Suggestion API 
      var googleSuggestionAPI = $resource('https://suggestqueries.google.com/complete/search', 
         { callback:'JSON_CALLBACK'},
         { get: {method: 'JSONP', isArray: true}}
      );

      //Public
      self.autoCompleteOn = true;
      self.synch = false;
      self.youTube = youTubeDataAPI;
      
      // Autocomplete on/of toggles necessary to stop md-autocomplete from
      // re-running search when a selection is made and the searchText updates/changes
      self.textChange = function(){
         self.autoCompleteOn = true;
      };

      // Autocomplete dropdown selection & Search button handler
      self.submit = function(searchTerm){

         self.autoCompleteOn = false;

         // Submit will get a bogus selection call when the searchboxes' models 
         // get synched on a query event. So, ignore and reset the flag
         if (self.synch){
            self.synch = false;

         // Otherwise this is for real: run query
         } else if (searchTerm && searchTerm.length){
            self.youTube.query(searchTerm);
         }
      };

      // Calls google to get array of youtube specific autocomplete suggestions 
      self.getSuggestions = function(val){

         // Autocomplete toggled on when query text changes
         if (self.autoCompleteOn){

            var results = [];
            var params = {'hl':'en', 'ds':'yt', 'q':val, 'client':'youtube' };
            
            return googleSuggestionAPI.get(params).$promise.then(function(data) {
         
               // Extract suggestion strings from response, excluding current query
               angular.forEach(data[1], function(item){ 
                  if (item[0] !== val){
                     results.push({value: item[0]});
                  }
               });

               // Trim results, return.
               if (results.length > 5){ 
                  results.length = 5; 
               }
               return results;
            });

         // Return empty array if autocomplete is toggled off on selection
         } else {
            return [];
         }
      };
   };
   searchboxCtrl.$inject = ['$scope', '$resource', 'youTubeDataAPI'];

   // Link (Event handlers)
   function searchboxEventHandlers(scope, elem, attrs, searchboxCtrl){

      scope.ctrl = searchboxCtrl;

      var mdElem = elem.find('md-autocomplete');
      var mdScope = mdElem.isolateScope();
      var mdCtrl = mdScope.$mdAutocompleteCtrl;

      // Keeps searchText and selectedItem synched across instances of search box
      // so that the last typed search is identical in toolbar and sidebar
      scope.$on('youTubeDataAPI:query', function(event, msg){
            scope.ctrl.synch = true;
            mdScope.searchText = msg;
            mdScope.selectedItem = {value: msg}
      });

      // Captures carriage return in input box and hacks into mdAutoComplete to execute
      // selection, close dropdown w/escape event. Does nothing if searchText is empty string 
      mdElem.bind('keypress', function(event){
      
         if (event.which === 13 && mdScope.searchText && mdScope.searchText.length ){
            mdCtrl.selectedItem = {value: mdScope.searchText}; // autocomplete watches this obj.
            mdCtrl.keydown({keyCode: 27}); // Escape closes dropdown.
            console.log('Executed loop');
         }
      });
   }
   

})();