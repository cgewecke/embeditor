'use strict';
var t_debug, t_debugII;

describe('Service: youTubeDataAPI', function (){

  var result, searchUrl, searchData, videoUrl, videoData, httpBackend, youtube, 
      scope, query, channel, $controller;
  // load the service's module
  beforeEach(module('embeditor'))
  beforeEach(module('yt.search.mockdata'));

  afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
  });

  describe('data format of a search result:', function(){
    
    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      query = $controller("mockYTquery", {$scope: scope});
      
      searchUrl = query.searchUrl.taylor_relev_any_page1;
      searchData = query.searchResponse.taylor_relev_any_page1;
      videoUrl = query.videoUrl.taylor_relev_any_page1;
      videoData = query.videoResponse.taylor_relev_any_page1;
      
      httpBackend.whenJSONP(searchUrl).respond(searchData);
      httpBackend.whenJSONP(videoUrl).respond(videoData);
  
    }));
    
    it('should have correct form', function(){

      youtube.results = [];
      youtube.query('taylor swift');
      httpBackend.flush();
      result = youtube.results[0];
      
      expect(result.title.length).toBeGreaterThan(0);
      expect(result.videoId.length).toBeGreaterThan(0);
      expect(result.duration.length).toBeGreaterThan(0);
      expect(result.publishedAt.length).toBeGreaterThan(0);
      expect(result.imageUrl.length).toBeGreaterThan(0);
      expect(result.channelId.length).toBeGreaterThan(0);
      expect(result.channelTitle.length).toBeGreaterThan(0);

    });
  });
  
  describe('public: setSearchOrder(newOrder)', function(){

    var searchRelUrl, searchRelData, videoRelUrl, videoRelData,
        searchDateUrl, searchDateData, videoDateUrl, videoDateData,
        searchRelUrl2, searchRelData2, videoRelUrl2, videoRelData2;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      query = $controller("mockYTquery", {$scope: scope});
      
      searchRelUrl = query.searchUrl.taylor_relev_any_page1;
      searchRelData = query.searchResponse.taylor_relev_any_page1;
      videoRelUrl = query.videoUrl.taylor_relev_any_page1;
      videoRelData = query.videoResponse.taylor_relev_any_page1;
      
      searchDateUrl = query.searchUrl.taylor_date_any_page1;
      searchDateData = query.searchResponse.taylor_date_any_page1;
      videoDateUrl = query.videoUrl.taylor_date_any_page1;
      videoDateData = query.videoResponse.taylor_date_any_page1;

      searchRelUrl2 = query.searchUrl.taylor_relev_any_page2;
      searchRelData2 = query.searchResponse.taylor_relev_any_page2;
      videoRelUrl2 = query.videoUrl.taylor_relev_any_page2;
      videoRelData2 = query.videoResponse.taylor_relev_any_page2;
      
      httpBackend.whenJSONP(searchRelUrl).respond(searchRelData);
      httpBackend.whenJSONP(videoRelUrl).respond(videoRelData);
      httpBackend.whenJSONP(searchDateUrl).respond(searchDateData);
      httpBackend.whenJSONP(videoDateUrl).respond(videoDateData);
      httpBackend.whenJSONP(searchRelUrl2).respond(searchRelData2);
      httpBackend.whenJSONP(videoRelUrl2).respond(videoRelData2);
  
    }));

    it('should toggle the new order and rerun the current search', function () {
      var firstCall, secondCall;
      
      youtube.results = [];

      youtube.query('taylor swift');
      httpBackend.flush();
      firstCall = youtube.results[0];
      
      expect(youtube.results.length).toEqual(1);

      youtube.setSearchOrder('date');
      httpBackend.flush()
      secondCall = youtube.results[0];
      
      expect(youtube.results.length).toEqual(1);
      expect(secondCall).not.toEqual(firstCall);

    });

    it('should do nothing if the passed value is the same as current order', function(){

      youtube.results = [];
      youtube.sortOrder = 'relevance';
      youtube.setSearchOrder('relevance');

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
      
      expect(youtube.results.length).toBe(0);

    });

    it('should return the first page of the new search', function(){

      youtube.results = [];
      youtube.query('taylor swift');
      httpBackend.flush();
      youtube.nextPage();
      httpBackend.flush();
      expect(youtube.results.length).toEqual(2);
      youtube.setSearchOrder('date');
      httpBackend.flush();
      expect(youtube.results.length).toEqual(1);

    });

  });

  describe('public: setDurationFilter(newDuration)', function(){

    var searchRelUrl, searchRelData, videoRelUrl, videoRelData,
        searchShortUrl, searchShortData, videoShortUrl, videoShortData,
        searchRelUrl2, searchRelData2, videoRelUrl2, videoRelData2;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      query = $controller("mockYTquery", {$scope: scope});
      
      searchRelUrl = query.searchUrl.taylor_relev_any_page1;
      searchRelData = query.searchResponse.taylor_relev_any_page1;
      videoRelUrl = query.videoUrl.taylor_relev_any_page1;
      videoRelData = query.videoResponse.taylor_relev_any_page1;
      
      searchShortUrl = query.searchUrl.taylor_relev_short_page1;
      searchShortData = query.searchResponse.taylor_relev_short_page1;
      videoShortUrl = query.videoUrl.taylor_relev_short_page1;
      videoShortData = query.videoResponse.taylor_relev_short_page1;

      searchRelUrl2 = query.searchUrl.taylor_relev_any_page2;
      searchRelData2 = query.searchResponse.taylor_relev_any_page2;
      videoRelUrl2 = query.videoUrl.taylor_relev_any_page2;
      videoRelData2 = query.videoResponse.taylor_relev_any_page2;
      
      httpBackend.whenJSONP(searchRelUrl).respond(searchRelData);
      httpBackend.whenJSONP(videoRelUrl).respond(videoRelData);
      httpBackend.whenJSONP(searchShortUrl).respond(searchShortData);
      httpBackend.whenJSONP(videoShortUrl).respond(videoShortData);
      httpBackend.whenJSONP(searchRelUrl2).respond(searchRelData2);
      httpBackend.whenJSONP(videoRelUrl2).respond(videoRelData2);
  
    }));

    it('should toggle the new filter and rerun the current search', function () {

      var firstCall, secondCall;

      youtube.results = [];

      youtube.query('taylor swift');
      httpBackend.flush();
      firstCall = youtube.results[0];
      
      expect(youtube.results.length).toEqual(1);

      youtube.setDurationFilter('short');
      httpBackend.flush()
      secondCall = youtube.results[0];
      
      expect(youtube.results.length).toEqual(1);
      expect(secondCall).not.toEqual(firstCall);
      
    });
    
    it('should do nothing if the passed value is the same as current order', function(){

      youtube.results = [];
      youtube.durationFilter = 'any';
      youtube.setDurationFilter('any');

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
      
      expect(youtube.results.length).toBe(0);


    });

    it('should get the first page of the new search', function(){

      youtube.results = [];
      youtube.query('taylor swift');
      httpBackend.flush();
      youtube.nextPage();
      httpBackend.flush();
      expect(youtube.results.length).toEqual(2);
      youtube.setDurationFilter('short');
      httpBackend.flush();
      expect(youtube.results.length).toEqual(1);

    });
  });

  describe('public: query(searchTerm)', function(){

    var searchRelUrl, searchRelData, videoRelUrl, videoRelData, output;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      query = $controller("mockYTquery", {$scope: scope});
      scope = $rootScope;
      
      searchRelUrl = query.searchUrl.taylor_relev_any_page1;
      searchRelData = query.searchResponse.taylor_relev_any_page1;
      videoRelUrl = query.videoUrl.taylor_relev_any_page1;
      videoRelData = query.videoResponse.taylor_relev_any_page1;

      output = query.output.taylor_relev_any_page1;
      
      
      httpBackend.whenJSONP(searchRelUrl).respond(searchRelData);
      httpBackend.whenJSONP(videoRelUrl).respond(videoRelData);

      spyOn(scope, '$broadcast');
  
    }));


    it('should run a search for the passed value and produce expected search result', function(){
      youtube.query('taylor swift');
      httpBackend.flush();
      expect(youtube.results[0]).toEqual(output[0]);
      
    });

    it('should broadcast a query event', function(){
      youtube.query('taylor swift');
      httpBackend.flush();
      expect(scope.$broadcast).toHaveBeenCalledWith('youTubeDataAPI:query', 'taylor swift');

    });

    it('should add the search to the search history', function(){
      youtube.query('taylor swift');
      httpBackend.flush();
      expect(youtube.history.length).toBe(1);

    });

  });

  describe('public: getChannelVideos(video)', function(){

    it('should add the search to the search history', function(){
    });

    it('should run a search for videos belonging to videos channel', function(){
    });
    
  });

  describe('public: getRelatedVideos(video)', function(){

    it('should add the search to the search history', function(){
    });

    it('should run a search for videos related to video', function(){
    });
    
  });

  describe('public: getAgain(historyItem)', function(){

    it('should run the search specified by the historyItem', function(){

    });

    it('should apply the current settings for order and filter', function(){

    });

    it('should return the first page of old search', function(){

    });
  });

  describe('public: nextPage()', function(){

    it('should get the nextPage of the current search', function(){

    });

    it('should set a public flag while it loads and unset when it returns', function(){

    });

    it('should do nothing if there are no more results', function(){

    });
  });

  describe('private: searchYouTube', function(){
    

    it('should get a list of videos from youtube', function(){

    });

    it('should strip out any duplicates', function(){

    })

    it('should set an error flag if it fails because of server error', function(){

    });

    it('should set a flag if there are no results', function(){


    });

    it('should set a flag if the current results are the last possible', function(){

    });

  });

});
