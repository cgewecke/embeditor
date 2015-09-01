var sr_debug, sr_debugII;
/**
 * @ngdoc function
 * @name embeditor.component:searchbox
 * @description
 * 
 */

(function () {
   'use strict';

   angular.module('embeditor.components.searchbox', ['embeditor.services.youTubeDataAPI'])

      .directive('embeditorSearchbox', searchbox);
      
   // Element
   function searchbox(){
      return {
         restrict: 'E',  
         controller: searchboxCtrl,
         link: searchboxEventHandlers,
         templateUrl:  'templates/searchbox.html'
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
      self.phone = ( navigator.userAgent.match(/(iPod|iPhone)/g) ? true : false );
      self.android = ( navigator.userAgent.match(/(Android)/g) ? true : false );
      
      // Autocomplete on/of toggles necessary to stop md-autocomplete from
      // re-running search when a selection is made and the searchText updates/changes
      self.textChange = function(){
         self.autoCompleteOn = true;
      };

      // Autocomplete dropdown selection & Search button handler
      self.submit = function(searchTerm){

         console.log('entering submit');

         self.autoCompleteOn = false;

         // Submit will get a bogus selection call when the searchboxes' models 
         // get synched on a query event. So, ignore and reset the flag
         if (self.synch){
            self.synch = false;

         // Otherwise this is for real: run query
         } else if (searchTerm && searchTerm.length){
            console.log('entering query');
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
      var mdInput = mdElem.find('input');
      var mdScope = mdElem.isolateScope();
      var mdCtrl = mdScope.$mdAutocompleteCtrl;

      // Keeps searchText and selectedItem synched across instances of search box
      // so that the last typed search is identical in toolbar and sidebar
      // On iphone this causes problems because it focusses the search box
      scope.$on('youTubeDataAPI:query', function(event, msg){

         // IPhone: Zero out inputs and blur so input is unfocussed
         // when the sidebar closes.
         if (scope.ctrl.phone ){
 
            mdScope.searchText = '';
            mdScope.selectedItem = {value: ''};
            mdInput.blur();

         // Desktop
         } else {
            scope.ctrl.synch = true;
            mdScope.searchText = msg;
            mdScope.selectedItem = {value: msg}

            // Firing escape might get rid of weird sticking open 
            // when sidenav closes . . .
            mdCtrl.keydown({keyCode: 27}); 

         }
            
      });

      
      // Captures carriage return in input box and hacks into mdAutoComplete to execute
      // selection, close dropdown w/escape event. Does nothing if searchText is empty string 
      mdElem.bind('keydown', function(event){

         console.log('keydown heard');
      
         if (event.which === 13 && mdScope.searchText && mdScope.searchText.length ){

            // Android: Submit must be explicitly called
            if ( scope.ctrl.android ){
               mdCtrl.keydown({keyCode: 27}); // Escape closes dropdown.
               scope.ctrl.submit(mdScope.searchText);
               mdInput.blur();
               scope.$apply();

            // Desktop, Tablet - watcher . . .
            } else {

               mdCtrl.keydown({keyCode: 27}); // Escape closes dropdown.
               mdCtrl.selectedItem = {value: mdScope.searchText}; // autocomplete watches this obj.
            }
         }
      });


      // IPhone: Captures blur event (triggered by 'Done'). Requires that submit be called
      // explicitly - the watcher is not reacting to the value change per above.
      mdInput.bind('blur', function(event){

         if ( scope.ctrl.phone && mdScope.searchText && mdScope.searchText.length ){
         
            mdCtrl.keydown({keyCode: 27}); // Escape closes dropdown.
            scope.ctrl.submit(mdScope.searchText);
            scope.$apply();
         }
      })
   }
   

})();
