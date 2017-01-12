'use strict';
var sb_testI, sb_testII, sb_testIII;


describe('Component: Search sidebar', function () {

  beforeEach(module('embeditor'));
  beforeEach(module('yt.search.mockdata'));
  beforeEach(module('templates'));

  var ctrl, scope, compile, query, dataAPI, playerAPI, mdSidenav, sidebar, httpBackend;

  beforeEach(inject(function ($controller, $rootScope, $compile, $httpBackend, _youTubeDataAPI_, youtubePlayerAPI, _$mdSidenav_) {

    scope = $rootScope.$new();
    mdSidenav = _$mdSidenav_;
    compile = $compile;
    httpBackend = $httpBackend;
    playerAPI = youtubePlayerAPI;
    dataAPI = _youTubeDataAPI_;
    dataAPI.default_max_results = 1;

    ctrl = $controller('SearchSidebarController', {$scope: scope, $mdSidenav: mdSidenav });
    query = $controller("mockYTquery", {$scope: scope });
  
    sidebar = angular.element('<embeditor-section-sidebar></embeditor-section-sidebar>');
    compile(sidebar)(scope);
    scope.$digest();
  }));

  it('should get toggled open when youTubeData executes a string query', function () {

    var searchUrl, searchData, videoUrl, videoData;
 
    // Regular query search
    searchUrl = query.searchUrl.taylor_relev_any_page1;
    searchData = query.searchResponse.taylor_relev_any_page1;
    videoUrl = query.videoUrl.taylor_relev_any_page1;
    videoData = query.videoResponse.taylor_relev_any_page1;

    httpBackend.whenJSONP(searchUrl).respond(searchData);
    httpBackend.whenJSONP(videoUrl).respond(videoData);

    dataAPI.query('taylor swift');
    httpBackend.flush();

    // Cannot spy on $mdSidnav('search').toggle
    // because we don't publicly expose the function instance created in 
    // the event watch (?) . . . but 'exists' is added to the service in the 
    // same block, verifying that it ran.
    expect(ctrl.mdSidenav.exists).not.toBeUndefined();

  });

  it('should show/hide the sidebar body msg div if there are/are not results', function(){
    var msgDiv;

    msgDiv = sidebar.find("div#ss-body-msg-container");
    dataAPI.results = [];
    scope.$apply();
    expect(msgDiv.hasClass('ng-hide')).toBe(false);

    dataAPI.results = [{item: "item"}];
    scope.$apply();
    expect(msgDiv.hasClass('ng-hide')).toBe(true);

  });

  it('should show/hide the "no results" msg div when the "failed" flag is t/f', function(){

    var msgDiv;

    msgDiv = sidebar.find("div#ss-no-results-msg");
    dataAPI.failed = false;
    scope.$apply();
    expect(msgDiv.hasClass('ng-hide')).toBe(true);

    dataAPI.failed = true;
    scope.$apply();
    expect(msgDiv.hasClass('ng-hide')).toBe(false);

  });

  it('should show/hide the "server error" msg div when the "server error" flag is t/f', function(){

    var msgDiv;

    msgDiv = sidebar.find("div#ss-server-error-msg");
    
    dataAPI.serverError = false;
    scope.$apply();
    expect(msgDiv.hasClass('ng-hide')).toBe(true);

    dataAPI.serverError = true;
    scope.$apply();
    expect(msgDiv.hasClass('ng-hide')).toBe(false);
  
  });

  it('should try to refetch the most recent search when the server error try again button is clicked', function(){

    var tryBtn, searchUrl, searchData, videoUrl, videoData;
 
    // Regular query search
    searchUrl = query.searchUrl.taylor_relev_any_page1;
    searchData = query.searchResponse.taylor_relev_any_page1;
    videoUrl = query.videoUrl.taylor_relev_any_page1;
    videoData = query.videoResponse.taylor_relev_any_page1;

    httpBackend.whenJSONP(searchUrl).respond(searchData);
    httpBackend.whenJSONP(videoUrl).respond(videoData);

    dataAPI.query('taylor swift');
    httpBackend.flush();

    spyOn(dataAPI, 'getAgain');
    dataAPI.searchError = true;
    scope.$apply();
    tryBtn = sidebar.find("button#ss-try-again-btn");
    tryBtn.triggerHandler('click');
    expect(dataAPI.getAgain).toHaveBeenCalledWith(dataAPI.history[0]);
    sb_testI = dataAPI.history[0];

  });

  it('should show the full body loading spinner while waiting for first results', function(){

    var msgDiv, searchUrl, searchData, videoUrl, videoData;
 
    // Regular query search
    searchUrl = query.searchUrl.taylor_relev_any_page1;
    searchData = query.searchResponse.taylor_relev_any_page1;
    videoUrl = query.videoUrl.taylor_relev_any_page1;
    videoData = query.videoResponse.taylor_relev_any_page1;

    httpBackend.whenJSONP(searchUrl).respond(searchData);
    httpBackend.whenJSONP(videoUrl).respond(videoData);

    msgDiv = sidebar.find("md-progress-circular#ss-body-loading-spinner");
    
    expect(msgDiv.hasClass('ng-hide')).toBe(true);
    dataAPI.query('taylor swift');
    scope.$apply();
    expect(msgDiv.hasClass('ng-hide')).toBe(false);
    httpBackend.flush();
    expect(msgDiv.hasClass('ng-hide')).toBe(true);

  });

  it('should show/hide the end of results tile when the end of results flag is t/f', function(){
    var msgBtn;

    msgBtn =  sidebar.find('button#ss-tile-end-msg');

    dataAPI.results = [{item: "item"}];
    dataAPI.endOfResults = false;
    scope.$apply();
    expect(msgBtn.hasClass('ng-hide')).toBe(true);

    dataAPI.endOfResults = true;
    scope.$apply();
    expect(msgBtn.hasClass('ng-hide')).toBe(false);

  });

  describe('"more" button and "more loading" spinner', function(){
    
    var searchRelUrl2, searchRelData2, videoRelUrl2, videoRelData2, 
        searchPage2Url, searchPage2Data, videoPage2Url, videoPage2Data, 
        msgBtn, spinner;

    beforeEach(function(){

      msgBtn =  sidebar.find('button#ss-tile-more-button');
      spinner = sidebar.find('md-progress-circular#ss-tile-loading-spinner');

      // Query: order by relevance, filter by any: Page 1 
      searchRelUrl2 = query.searchUrl.taylor_relev_any_page1;
      searchRelData2 = query.searchResponse.taylor_relev_any_page1;
      videoRelUrl2 = query.videoUrl.taylor_relev_any_page1;
      videoRelData2 = query.videoResponse.taylor_relev_any_page1;
      
      httpBackend.whenJSONP(searchRelUrl2).respond(searchRelData2);
      httpBackend.whenJSONP(videoRelUrl2).respond(videoRelData2);

      // Query: Order by relevance, filter by any: Page 2
      searchPage2Url = query.searchUrl.taylor_relev_any_page2;
      searchPage2Data = query.searchResponse.taylor_relev_any_page2;
      videoPage2Url = query.videoUrl.taylor_relev_any_page2;
      videoPage2Data = query.videoResponse.taylor_relev_any_page2;

      httpBackend.whenJSONP(searchPage2Url).respond(searchPage2Data);
      httpBackend.whenJSONP(videoPage2Url).respond(videoPage2Data);

    });

    it('should load more results when the more button is clicked', function(){

      spyOn(dataAPI, 'nextPage');
      msgBtn.triggerHandler('click');
      expect(dataAPI.nextPage).toHaveBeenCalled();

    });

    it('should show a more button if there are current results and more possible results', function(){
      
      dataAPI.results = [];
      scope.$apply();
      expect(msgBtn.hasClass('ng-hide')).toBe(true);

      dataAPI.results = [{item: "item"}];
      dataAPI.endOfResults = false;
      scope.$apply();
      expect(msgBtn.hasClass('ng-hide')).toBe(false);

      dataAPI.results = [{item: "item"}];
      dataAPI.endOfResults = true;
      scope.$apply();
      expect(msgBtn.hasClass('ng-hide')).toBe(true);

    });

    it('more button should hide as results load, then re-appear', function(){

      dataAPI.query('taylor swift');
      httpBackend.flush();
      expect(msgBtn.hasClass('ng-hide')).toBe(false);

      dataAPI.nextPage();
      scope.$apply();
      expect(msgBtn.hasClass('ng-hide')).toBe(true);

      httpBackend.flush();
      scope.$apply();
      expect(msgBtn.hasClass('ng-hide')).toBe(false);

    });

    it('spinner should show as results load, hide otherwise', function(){

      dataAPI.query('taylor swift');
      httpBackend.flush();
      expect(spinner.hasClass('ng-hide')).toBe(true);

      dataAPI.nextPage();
      scope.$apply();
      expect(spinner.hasClass('ng-hide')).toBe(false);

      httpBackend.flush();
      scope.$apply();
      expect(spinner.hasClass('ng-hide')).toBe(true);
    });
  });

  describe('search item', function(){

    var searchItem;

    beforeEach(function(){
      scope.video = {videoId: 1}; 
      searchItem = angular.element('<embeditor-search-item video="video"></embeditor-search-item>');
      compile(searchItem)(scope);
      playerAPI.load = function(id){}; // Mock function, since API derived from YT Iframe
      scope.$digest();
    });

    it('should get related videos when the related button is clicked', function(){
      spyOn(dataAPI, 'getRelatedVideos' );
      var related = searchItem.find(".searchRelatedIcon");
      related.triggerHandler('click');
      scope.$apply();
      expect(dataAPI.getRelatedVideos).toHaveBeenCalledWith(scope.video);

    });

    it('should not play the video when the related button is clicked,', function(){
      var searchQ = query.searchUrl.shakeRelated_rel_any_page1;
      var related = searchItem.find(".searchRelatedIcon");
      
      httpBackend.whenJSONP(searchQ).respond('');
      spyOn(playerAPI, 'load' );

      related.triggerHandler('click');
      expect(playerAPI.load).not.toHaveBeenCalled();
    });

    it('should get channel videos when the channel link is clicked', function(){
      
      var channel;

      spyOn(dataAPI, 'getChannelVideos' );
      channel = searchItem.find(".searchItemChannelContainer");
      channel.triggerHandler('click');
      expect(dataAPI.getChannelVideos).toHaveBeenCalledWith(scope.video);

    });

    it('should play the video when the thumbnail area is clicked', function(){
      var thumbnail;

      spyOn(playerAPI, 'load');
      thumbnail = searchItem.find(".searchPlayIcon");
      thumbnail.triggerHandler('click');
      expect(playerAPI.load).toHaveBeenCalledWith(scope.video);

    });

  });

});
