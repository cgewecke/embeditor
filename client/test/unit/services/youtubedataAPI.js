'use strict';
var t_debug, t_debugII;

describe('Service: youTubeDataAPI', function (){

  var httpBackend, youtube, scope, query, channel, error;

  // load the service's module
  beforeEach(module('embeditor'))
  beforeEach(module('yt.search.mockdata'));

  afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
  });

  describe('private: searchYouTube', function(){

    var searchUrl, searchData, videoUrl, videoData, call1, call2,
        searchUrlGibberish, searchDataGibberish, videoUrlGibberish, videoDataGibberish,
        searchUrlLast, searchDataLast, videoUrlLast, videoDataLast ;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      youtube.default_max_results = 1;

      query = $controller("mockYTquery", {$scope: scope});
      error = $controller("mockYTerror", {$scope: scope});

      
      // Regular query search
      searchUrl = query.searchUrl.taylor_relev_any_page1;
      searchData = query.searchResponse.taylor_relev_any_page1;
      videoUrl = query.videoUrl.taylor_relev_any_page1;
      videoData = query.videoResponse.taylor_relev_any_page1;

      call1 = httpBackend.whenJSONP(searchUrl).respond(searchData);
      call2 = httpBackend.whenJSONP(videoUrl).respond(videoData);

    }));
    

    it('should get a list of videos from youtube', function(){
      youtube.query('taylor swift');
      httpBackend.flush();
      expect(youtube.results.length).toBeGreaterThan(0);      

    });

    it('should construct video objects correctly', function(){

      var result;

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

    it('should strip out any duplicates', function(){

    })

    it('should set the serverError flag on server error', function(){

      call1.respond(500, '');
      youtube.query('taylor swift');
      expect(youtube.serverError).toBe(false);
      httpBackend.flush();
      expect(youtube.serverError).toBe(true);

      call1.respond(searchData);
      call2.respond(500, '');
      youtube.query('taylor swift');
      expect(youtube.serverError).toBe(false);
      httpBackend.flush();
      expect(youtube.serverError).toBe(true);

    });

    it('should set the failed flag if there are no results', function(){

      // Gibberish query search that returns 0 results
      searchUrlGibberish = error.searchUrl.gibberish;
      searchDataGibberish = error.searchResponse.gibberish;
      videoUrlGibberish = error.videoUrl.gibberish;
      videoDataGibberish = error.videoResponse.gibberish

      httpBackend.whenJSONP(searchUrlGibberish).respond(searchDataGibberish);
      httpBackend.whenJSONP(videoUrlGibberish).respond(videoDataGibberish);

      youtube.query('fjdksljfklds');
      expect(youtube.failed).toBe(false);
      httpBackend.flush();
      expect(youtube.failed).toBe(true);
      expect(youtube.results.length).toBe(0);

    });

    it('should set the endOfResults flag if the current results are the last possible', function(){

      // Terminal result of a query search: 'taylor'
      searchUrlLast = error.searchUrl.lastResult;
      searchDataLast = error.searchResponse.lastResult;
      videoUrlLast = error.videoUrl.lastResult;
      videoDataLast = error.videoResponse.lastResult;

      httpBackend.whenJSONP(searchUrlLast).respond(searchDataLast);
      httpBackend.whenJSONP(videoUrlLast).respond(videoDataLast);

      youtube.query('taylor');
      expect(youtube.endOfResults).toBe(false);
      httpBackend.flush();
      expect(youtube.endOfResults).toBe(true);

    });

  });
  
  describe('public: nextPage()', function(){

    var searchRelUrl2, searchRelData2, videoRelUrl2, videoRelData2, 
        searchPage2Url, searchPage2Data, videoPage2Url, videoPage2Data, 
        query_expected, page2_expected,
        query;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      youtube.default_max_results = 1;

      query = $controller("mockYTquery", {$scope: scope});

      // Query: order by relevance, filter by any: Page 1 
      searchRelUrl2 = query.searchUrl.taylor_relev_any_page1;
      searchRelData2 = query.searchResponse.taylor_relev_any_page1;
      videoRelUrl2 = query.videoUrl.taylor_relev_any_page1;
      videoRelData2 = query.videoResponse.taylor_relev_any_page1;

      query_expected = query.output.taylor_relev_any_page1;
      
      httpBackend.whenJSONP(searchRelUrl2).respond(searchRelData2);
      httpBackend.whenJSONP(videoRelUrl2).respond(videoRelData2);

      // Query: Order by relevance, filter by any: Page 2
      searchPage2Url = query.searchUrl.taylor_relev_any_page2;
      searchPage2Data = query.searchResponse.taylor_relev_any_page2;
      videoPage2Url = query.videoUrl.taylor_relev_any_page2;
      videoPage2Data = query.videoResponse.taylor_relev_any_page2;

      httpBackend.whenJSONP(searchPage2Url).respond(searchPage2Data);
      httpBackend.whenJSONP(videoPage2Url).respond(videoPage2Data);

      page2_expected = query.output.taylor_relev_any_page2;

    }));

    it('should get the nextPage of the current search', function(){
      
      youtube.query('taylor swift');
      httpBackend.flush();
    
      youtube.nextPage();
      httpBackend.flush();

      expect(youtube.results[1]).toEqual(page2_expected[1]);
      
    });

    it('should do nothing if there are no more results', function(){
      
      youtube.query('taylor swift');
      httpBackend.flush();

      youtube.endOfResults = true;
      youtube.nextPage();
      
      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();

      expect(youtube.results.length).toBe(1);

    });
  });
  

  describe('public: query(searchTerm)', function(){

    var searchRelUrl, searchRelData, videoRelUrl, videoRelData, expected_output;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      youtube.default_max_results = 1;

      query = $controller("mockYTquery", {$scope: scope});
      scope = $rootScope;
      
      searchRelUrl = query.searchUrl.taylor_relev_any_page1;
      searchRelData = query.searchResponse.taylor_relev_any_page1;
      videoRelUrl = query.videoUrl.taylor_relev_any_page1;
      videoRelData = query.videoResponse.taylor_relev_any_page1;

      expected_output = query.output.taylor_relev_any_page1;
      
      httpBackend.whenJSONP(searchRelUrl).respond(searchRelData);
      httpBackend.whenJSONP(videoRelUrl).respond(videoRelData);

      spyOn(scope, '$broadcast');
  
    }));


    it('should run a search for the passed value and produce expected search result', function(){
      youtube.query('taylor swift');
      httpBackend.flush();
      expect(youtube.results[0]).toEqual(expected_output[0]);
      
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
    var searchRelUrl, searchRelData, videoRelUrl, videoRelData, output;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      youtube.default_max_results = 1;

      channel = $controller("mockYTchannel", {$scope: scope});
      
      searchRelUrl = channel.searchUrl.yale_relev_any_page1;
      searchRelData = channel.searchResponse.yale_relev_any_page1;
      videoRelUrl = channel.videoUrl.yale_relev_any_page1;
      videoRelData = channel.videoResponse.yale_relev_any_page1;

      output = channel.output.yale_relev_any_page1;
      
      httpBackend.whenJSONP(searchRelUrl).respond(searchRelData);
      httpBackend.whenJSONP(videoRelUrl).respond(videoRelData);

    }));

    it('should add the search to the search history', function(){
      youtube.getChannelVideos({'channelId': 'UC4EY_qnSeAP1xGsh61eOoJA'});
      httpBackend.flush();
      expect(youtube.history.length).toBe(1);
    });

    it('should run a search for videos belonging to videos channel and produce expected search result', function(){
      youtube.getChannelVideos({'channelId': 'UC4EY_qnSeAP1xGsh61eOoJA'});
      httpBackend.flush();
      expect(youtube.results[0]).toEqual(output[0]);

    });
    
  });

  describe('public: getRelatedVideos(video)', function(){

    var searchRelUrl, searchRelData, videoRelUrl, videoRelData, output, related;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      youtube.default_max_results = 1;

      related = $controller("mockYTrelated", {$scope: scope});
      
      searchRelUrl = related.searchUrl.shakeRelated_rel_any_page1;
      searchRelData = related.searchResponse.shakeRelated_rel_any_page1;
      videoRelUrl = related.videoUrl.shakeRelated_rel_any_page1;
      videoRelData = related.videoResponse.shakeRelated_rel_any_page1;

      output = related.output.shakeRelated_rel_any_page1;
      
      httpBackend.whenJSONP(searchRelUrl).respond(searchRelData);
      httpBackend.whenJSONP(videoRelUrl).respond(videoRelData);

    }));

    it('should add the search to the search history', function(){
      youtube.getRelatedVideos({'videoId': 'nfWlot6h_JM'});
      httpBackend.flush();
      expect(youtube.history.length).toBe(1);
    });

    it('should run a search for videos related to video', function(){
      youtube.getRelatedVideos({'videoId': 'nfWlot6h_JM'});
      httpBackend.flush();
      expect(youtube.results[0]).toEqual(output);
    });
    
  });

  describe('public: setSearchOrder(newOrder)', function(){

    var searchRelUrl, searchRelData, videoRelUrl, videoRelData,
        searchDateUrl, searchDateData, videoDateUrl, videoDateData,
        searchRelUrl2, searchRelData2, videoRelUrl2, videoRelData2;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {
      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      youtube.default_max_results = 1;

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

      // Multipage request
      youtube.results = [];
      youtube.query('taylor swift');
      httpBackend.flush();
      youtube.nextPage();
      httpBackend.flush();
      expect(youtube.results.length).toEqual(2);
      
      // Set search order
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
      youtube.default_max_results = 1;

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

  describe('public: getAgain(historyItem)', function(){

    var searchRelUrl, searchRelData, videoRelUrl, videoRelData, 
        searchRelUrl2, searchRelData2, videoRelUrl2, videoRelData2, 
        searchDateUrl, searchDateData, videoDateUrl, videoDateData,
        searchShortUrl, searchShortData, videoShortUrl, videoShortData, 
        searchPage2Url, searchPage2Data, videoPage2Url, videoPage2Data, 
        related_output, query_output, date_output, short_output, page2_output,
        related, query;

    beforeEach(inject( function($controller, $rootScope, $httpBackend, youTubeDataAPI) {

      httpBackend = $httpBackend;
      youtube = youTubeDataAPI;
      youtube.default_max_results = 1;

      related = $controller("mockYTrelated", {$scope: scope});
      query = $controller("mockYTquery", {$scope: scope});

      // Related Videos: order by relevance, filter by any
      searchRelUrl = related.searchUrl.shakeRelated_rel_any_page1;
      searchRelData = related.searchResponse.shakeRelated_rel_any_page1;
      videoRelUrl = related.videoUrl.shakeRelated_rel_any_page1;
      videoRelData = related.videoResponse.shakeRelated_rel_any_page1;

      related_output = related.output.shakeRelated_rel_any_page1;

      httpBackend.whenJSONP(searchRelUrl).respond(searchRelData);
      httpBackend.whenJSONP(videoRelUrl).respond(videoRelData);

      // Query: order by relevance, filter by any: Page 1 
      searchRelUrl2 = query.searchUrl.taylor_relev_any_page1;
      searchRelData2 = query.searchResponse.taylor_relev_any_page1;
      videoRelUrl2 = query.videoUrl.taylor_relev_any_page1;
      videoRelData2 = query.videoResponse.taylor_relev_any_page1;

      query_output = query.output.taylor_relev_any_page1;
      
      httpBackend.whenJSONP(searchRelUrl2).respond(searchRelData2);
      httpBackend.whenJSONP(videoRelUrl2).respond(videoRelData2);

      // Query: Order by relevance, filter by any: Page 2
      searchPage2Url = query.searchUrl.taylor_relev_any_page2;
      searchPage2Data = query.searchResponse.taylor_relev_any_page2;
      videoPage2Url = query.videoUrl.taylor_relev_any_page2;
      videoPage2Data = query.videoResponse.taylor_relev_any_page2;

      httpBackend.whenJSONP(searchPage2Url).respond(searchPage2Data);
      httpBackend.whenJSONP(videoPage2Url).respond(videoPage2Data);

      page2_output = query.output.taylor_relev_any_page2;

      // Query: order by date, filter by length: 
      searchDateUrl = query.searchUrl.taylor_date_any_page1;
      searchDateData = query.searchResponse.taylor_date_any_page1;
      videoDateUrl = query.videoUrl.taylor_date_any_page1;
      videoDateData = query.videoResponse.taylor_date_any_page1;

      httpBackend.whenJSONP(searchDateUrl).respond(searchDateData);
      httpBackend.whenJSONP(videoDateUrl).respond(videoDateData);
      date_output = query.output.taylor_date_any_page1;

      // Query: Order by relevance, filter by length: short
      searchShortUrl = query.searchUrl.taylor_relev_short_page1;
      searchShortData = query.searchResponse.taylor_relev_short_page1;
      videoShortUrl = query.videoUrl.taylor_relev_short_page1;
      videoShortData = query.videoResponse.taylor_relev_short_page1;

      httpBackend.whenJSONP(searchShortUrl).respond(searchShortData);
      httpBackend.whenJSONP(videoShortUrl).respond(videoShortData);
      short_output = query.output.taylor_relev_short_page1;

    }));

    it('should run the search specified by the historyItem', function(){
      
      youtube.getRelatedVideos({'title': 'shake it off', 'videoId': 'nfWlot6h_JM'});
      httpBackend.flush();

      youtube.query('taylor swift');
      httpBackend.flush();

      youtube.getAgain(youtube.history[1]);
      httpBackend.flush();
      
      expect(youtube.results[0]).toEqual(related_output);
    });

    it('should apply the current settings for order', function(){
      var initial_result, result_from_getAgain, result_ord_by_date;

      youtube.query('taylor swift');
      httpBackend.flush();
      initial_result = youtube.results[0];

      youtube.setSearchOrder('date');
      httpBackend.flush();
      result_ord_by_date = youtube.results[0];

      youtube.getAgain(youtube.history[0]);
      httpBackend.flush();
      result_from_getAgain = youtube.results[0];

      expect(result_from_getAgain).not.toEqual(initial_result);
      expect(result_from_getAgain).toEqual(result_ord_by_date);

    });

    it('should apply the current settings for filter', function(){
      var initial_result, result_from_getAgain,result_filt_by_short;

      youtube.query('taylor swift');
      httpBackend.flush();
      initial_result = youtube.results[0];

      youtube.setDurationFilter('short');
      httpBackend.flush();
      result_filt_by_short = youtube.results[0];

      youtube.getAgain(youtube.history[0]);
      httpBackend.flush();
      result_from_getAgain = youtube.results[0];

      expect(result_from_getAgain).not.toEqual(initial_result);
      expect(result_from_getAgain).toEqual(result_filt_by_short);

    });

    it('should return the first page of old search', function(){

      var initial_result, result_from_getAgain, result_page_2;

      youtube.query('taylor swift');
      httpBackend.flush();
      initial_result = youtube.results[0];

      youtube.nextPage();
      httpBackend.flush();
      result_page_2 = youtube.results[1];

      youtube.getAgain(youtube.history[0]);
      httpBackend.flush();
      result_from_getAgain = youtube.results[0];

      expect(result_from_getAgain).not.toEqual(result_page_2);
      expect(result_from_getAgain).toEqual(initial_result);

    });
 
  });  


});
