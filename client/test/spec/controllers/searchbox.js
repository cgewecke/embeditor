'use strict';

var debug_I, debug_II;

describe('Controller: SearchboxCtrl', function () {

  // load the controller's module
  beforeEach(module('embeditor'));

  describe('submitting a search query via md-autocomplete form', function(){

    var scope, ctrl, form, searchButton, event;

    beforeEach(inject( function($controller, $rootScope, $compile ) {

      scope = $rootScope.$new();
      ctrl = $controller("SearchboxCtrl", {$scope: scope});
      scope.ctrl = ctrl;

      form = angular.element(

        "<form ng-controller='SearchboxCtrl as ctrl'><md-autocomplete flex search-box-submit-on-return placeholder='Search YouTube'" +
        "md-selected-item='ctrl.selectedItem' md-search-text='ctrl.searchText' md-search-text-change='ctrl.textChange()'" +
        "md-selected-item-change='ctrl.submit(ctrl.selectedItem.value)' md-items='item in ctrl.getSuggestions(ctrl.searchText)'" + 
        "md-item-text='item.value'></form>");

      searchButton = angular.element("<div><md-button ng-click='ctrl.submit(ctrl.searchText)'><md-icon></md-icon></md-button><div>");
      
      $compile(searchButton)(scope);
      $compile(form)(scope);

      scope.$digest();
      spyOn(ctrl.youTube, 'query');

    }));

    it ('should query youTubeDataAPI with the current search box contents when the spyglass button is clicked', function(){

      ctrl.searchText = "taylor swift";
      ctrl.submit(ctrl.searchText);
      expect(ctrl.youTube.query).toHaveBeenCalledWith('taylor swift');
    });

    it ('should query youTubeDataAPI with suggestion string when a selection is made from the dropdown', function(){
      var elem = form.find('md-autocomplete');
      elem.scope().ctrl.selectedItem = { value:'nikki' };
      elem.scope().$apply();
      expect(ctrl.youTube.query).toHaveBeenCalledWith('nikki');
    });

    it ('should query youTubeDataAPI with the current search box contents on carriage return', function(){
      
      var elem = form.find('md-autocomplete');
      elem.scope().ctrl.searchText = 'taylor swift';

      event = jQuery.Event('keypress');
      event.which = 13;
      elem.trigger(event);
      elem.scope().$apply();

      expect(ctrl.youTube.query).toHaveBeenCalledWith('taylor swift');
    });


    it ('should not query youTubeDataAPI with an empty string', function(){
      ctrl.submit('');
      expect(ctrl.youTube.query).not.toHaveBeenCalled();
    });

  });

  describe('SearchboxCtrl.getSuggestions: fetching data from googleSuggestionAPI', function(){

    var scope, ctrl, httpBackend, results, query;
    
    beforeEach(inject( function($controller, $rootScope, googleSuggestionAPI, $httpBackend) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();
        ctrl = $controller("SearchboxCtrl", {$scope: scope, googleSuggestionAPI: googleSuggestionAPI});
        results = null;
        query = 'taylor swift';

        var mockData = ["taylor swift",[["taylor swift",0],["taylor swift style",0],
          ["taylor swift blank space",0],["taylor swift shake it off",0],["taylor swift 1989 full album",0],
          ["taylor swift blank space lyrics",0],["taylor swift style lyrics",0],
          ["taylor swift i knew you were trouble",0],["taylor swift out of the woods",0],
          ["taylor swift 22",0]],{"k":1,"q":"nUelgMSxSWzhhaN_y0fPq6zCVyI"}];
        
        var url = "https://suggestqueries.google.com/complete/search?callback=JSON_CALLBACK&client=youtube&ds=yt&hl=en&q=taylor+swift";
        httpBackend.whenJSONP(url).respond(mockData);

        // Execute query request.
        ctrl.getSuggestions(query).then(function(response){ 
          results = response; 
        });
      
        httpBackend.flush();
      }
    ));
    
    it('returns an array of autocomplete suggestions w/form: [{value: STRING }, . . .]', function(){
           
      expect(results).toEqual([{value: "taylor swift style"}, {value: "taylor swift blank space" }, 
         {value: "taylor swift shake it off"}, {value: "taylor swift 1989 full album"} , 
         {value: "taylor swift blank space lyrics"}]);
    });

    it('should not duplicate the query string in the results', function(){
      
      expect(results).not.toContain(jasmine.objectContaining({value: "taylor swift"}));
    });
  });

  //describe('SearchboxCtrl')
  
});
