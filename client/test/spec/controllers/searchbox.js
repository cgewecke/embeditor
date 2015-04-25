'use strict';

describe('Controller: SearchboxCtrl', function () {

  // load the controller's module
  beforeEach(module('embeditor'));

  beforeEach(inject( function($controller, $rootScope, youTubeDataAPI ) {
      scope = $rootScope.$new();
      ctrl = $controller("SearchboxCtrl", {$scope: scope, youTubeDataAPI: youTubeDataAPI});
    }
  ));

  it ('should query youTubeDataAPI with the current search box contents when the spyglass button is clicked', function(){

  })

  it ('should query youTubeDataAPI with search string when a selection is made from the autoComplete dropdown', function(){

  })

  it ('should query youTubeDataAPI with the current search box contents when carriage return is hit', function(){

  })

  it ('should not query youTubeDataAPI with an empty string', function(){

  })

  describe('SearchboxCtrl.getSuggestions', function(){

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
        
        var url = "https://suggestqueries.google.com/complete/search?callback=JSON_CALLBACK&client=youtube&ds=yt&hl=en&q=taylor+swift"
        httpBackend.whenJSONP(url).respond(mockData);

        // Execute query request.
        ctrl.getSuggestions(query).then(function(response){ 
          results = response 
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
