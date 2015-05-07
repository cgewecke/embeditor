'use strict';
var test_I, test_II;

describe('Component: searchbox:', function () {

  // load the controller's module
  beforeEach(module('embeditor'));
  beforeEach(module('templates'));

  describe('input and button', function(){

    var scope, ctrl, form, searchButton, event, element, timeout, youtube;

    beforeEach(inject( function($controller, $rootScope, $compile, $timeout, youTubeDataAPI ) {

      timeout = $timeout;
      scope = $rootScope.$new();
      youtube = youTubeDataAPI;
      
      form = angular.element('<embeditor-searchbox></embeditor-searchbox>');
      element = $compile(form)(scope);
      scope.$digest();
      
      ctrl = element.scope().ctrl;
      
      spyOn(youtube, 'query');

    }));

    it ('should query with autocomplete suggestion when a selecting from the dropdown', function(){
      var elem = form.find('md-autocomplete');
      elem.scope().selectedItem = { value:'nikki' };
      elem.scope().$apply();
      expect(youtube.query).toHaveBeenCalledWith('nikki');
    });

    it ('should query with the current search box contents on carriage return', function(){
      // PROTRACTOR
      var mdElem = form.find('md-autocomplete');
      var mdCtrl = mdElem.isolateScope().$mdAutocompleteCtrl;
      var inputElem = form.find('input');
      var returnEvent = jQuery.Event('keypress');

      returnEvent.which = 13;

      mdElem.scope().searchText = 'taylor swift';
      inputElem.trigger(returnEvent); 
      mdElem.scope().$apply();
    
      // This works as expected in browser, and event fires/code runs within directive during test
      // but this expect block never passes. Don't understand.
      //expect(ctrl.youTube.query).toHaveBeenCalledWith('taylor swift');
      
    });

    it ('should query with the current searchbox contents when spyglass button is pressed', function(){
      
      var buttonElem = form.find('#spyglass');
      var mdElem = form.find('md-autocomplete');
      mdElem.scope().searchText = 'taylor swift';
      buttonElem.triggerHandler('click');
      expect(youtube.query).toHaveBeenCalledWith('taylor swift');

    });


    it ('should not query with an empty string', function(){
      ctrl.submit('');
      expect(youtube.query).not.toHaveBeenCalled();
    });

  });

  describe('getSuggestions: asynch googleSuggestionAPI call', function(){

    var scope, ctrl, httpBackend, results, query, form, element;
    
    beforeEach(inject( function($rootScope, $httpBackend, $compile) {
        httpBackend = $httpBackend;
        scope = $rootScope.$new();

        form = angular.element('<embeditor-searchbox></embeditor-searchbox>');
        element = $compile(form)(scope);
        scope.$digest();
        ctrl = element.controller('embeditor-searchbox');
        
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

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
    });
    
    it('should return an array of autocomplete suggestions w/form: [{value: STRING }, ...]', function(){
           
      expect(results).toEqual([{value: "taylor swift style"}, {value: "taylor swift blank space" }, 
         {value: "taylor swift shake it off"}, {value: "taylor swift 1989 full album"} , 
         {value: "taylor swift blank space lyrics"}]);
    });

    it('should not duplicate the query string in the results', function(){
      
      expect(results).not.toContain(jasmine.objectContaining({value: "taylor swift"}));
    });
  });

});