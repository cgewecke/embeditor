'use strict';
var sr_debug, sr_debugII;
/**
 * @ngdoc function
 * @name embeditor.controller:SearchboxCtrl
 * @description
 * # SearchboxCtrl
 * Controller of the embeditor: 
 */
angular.module('embeditor')

   .factory('googleSuggestionAPI', ['$resource', function($resource){
      return $resource("https://suggestqueries.google.com/complete/search", 
         { callback:"JSON_CALLBACK"},
         { get: {method: "JSONP", isArray: true}}
      );
   }])
   .controller('SearchboxCtrl', ['$scope', 'googleSuggestionAPI', 'youTubeDataAPI', 
      function ($scope, googleSuggestionAPI, youTubeDataAPI ) {

      var self = this;
      self.autoCompleteOn = true;
      self.youTube = youTubeDataAPI;
      
      // Autocomplete toggles necessary to stop md-autocomplete from
      // re-running search when a selection is made and the searchText updates/changes
      this.textChange = function(){
         self.autoCompleteOn = true;
      }

      // Carriage return handler
      this.keypress = function($event, searchTerm){
         if ($event === 13)
            self.youTube.query(searchTerm)
      }
      // Autocomplete Selection/Search button handler
      this.submit = function(searchTerm){
         self.autoCompleteOn = false;
         self.youTube.query(searchTerm);
      }

      // Calls google to get array of youtube specific autocomplete suggestions 
      this.getSuggestions = function(val){

         // Autocomplete toggled on when query text changes
         if (self.autoCompleteOn){

            console.log("Entering autoSuggest");
            var results = [];
            var autoParams = {'hl':'en', 'ds':'yt', 'q':val, 'client':'youtube' };
            
            return googleSuggestionAPI.get(autoParams).$promise.then(function(data) {
         
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
      }
    
  }]);
