'use strict';

describe('Service: youTubeDataAPI', function () {

  // load the service's module
  beforeEach(module('embeditor'));

  // instantiate service
  var youtube;
  beforeEach(inject(function (_youTubeDataAPI_) {
    youtube = _youTubeDataAPI_;
  }));

  describe('data format of a search result:', function(){
    var result;

    it('should have correct form', function(){
      youtube.results = [];

      youtube.query('grexit');
      httpbackend.flush();
      result = results[0];
      
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

    it('should toggle the new order and rerun the current search', function () {
      var firstCall, secondCall;
      
      youtube.setSearchOrder('relevance');
      youtube.query('taylor swift');
      firstCall = youtube.results[0];
      
      youtube.setSearchOrder('date');
      youtube.query('taylor swift');
      secondCall = youtube.results[0];
      
      //expect( difference btween first and second );

    });

    it('should do nothing if the passed value is the same as current order', function(){

      youtube.results = [];
      youtube.sortOrder = 'relevance';
      youtube.setSearchOrder('relevance');
      expect(youtube.results.length).toBe(0);

    });

    it('should return the first page of the new search', function(){


    });

  });

  describe('public: setDurationFilter(newDuration)', function(){

    it('should set future searches to new filter', function () {
      
    });
    
    it('should do nothing if the passed value is the same as current order', function(){

    });

    it('should rerun the current search for the new filter', function(){

    });

    it('should get the first page of the new search', function(){

    });
  });

  describe('public: query(searchTerm)', function(){

    it('should broadcast a query event', function(){
    });

    it('should add the search to the search history', function(){
    });

    it('should run a search for the passed value', function(){
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
    
    it('should return a promise', function(){

    });

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
