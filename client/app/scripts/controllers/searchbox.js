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

   .controller('SearchboxCtrl', ['$scope', 'googleSuggestionAPI', 'youTubeDataAPI', 
      function ($scope, googleSuggestionAPI, youTubeDataAPI) {

      var self = this;

      self.autoCompleteOn = true;
      self.youTube = youTubeDataAPI;
      
      // Autocomplete on/of toggles necessary to stop md-autocomplete from
      // re-running search when a selection is made and the searchText updates/changes
      self.textChange = function(){
         self.autoCompleteOn = true;
      };

      // Autocomplete dropdown selection & Search button handler
      self.submit = function(searchTerm){
         console.log('submit');
         self.autoCompleteOn = false;

         if (searchTerm && searchTerm.length){
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
    
   }])

   // Google Suggestion API $Resource
   .factory('googleSuggestionAPI', ['$resource', function($resource){
      return $resource('https://suggestqueries.google.com/complete/search', 
         { callback:'JSON_CALLBACK'},
         { get: {method: 'JSONP', isArray: true}}
      );
   }])

   // Captures carriage return in input box and hacks into mdAutoComplete to execute
   // selection, close dropdown w/escape event. Does nothing if searchText is empty string 
   .directive('searchBoxSubmitOnReturn', function(){
      return {
         restrict: 'A',
         require: 'mdAutocomplete',
         link: function(scope, elem, attrs, mdCtrl){
   
            elem.bind('keypress', function(event){
               sr_debugII = scope;
               if (event.which === 13 && scope.searchText && scope.searchText.length ){

                  mdCtrl.selectedItem = {value: scope.searchText}; // autocomplete watches this obj.
                  mdCtrl.keydown({keyCode: 27}); // Escape closes dropdown.
               }
            });
         }
      }
   })
