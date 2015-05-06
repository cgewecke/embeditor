'use strict';
var sb_testI, sb_testII;


describe('Component: Search sidebar', function () {

  beforeEach(module('embeditor'));
  beforeEach(module('yt.search.mockdata'));

  var ctrl, scope, compile, query, dataAPI, playerAPI, mdSidenav, httpBackend;

  beforeEach(inject(function ($controller, $rootScope, $compile, $httpBackend, youTubeDataAPI, youtubePlayerAPI, _$mdSidenav_) {

    scope = $rootScope.$new();
    mdSidenav = _$mdSidenav_;
    compile = $compile;
    httpBackend = $httpBackend;
    playerAPI = youtubePlayerAPI;
    dataAPI = youTubeDataAPI;
    dataAPI.default_max_results = 1;

    ctrl = $controller('SearchSidebarCtrl', {$scope: scope, $mdSidenav: mdSidenav });
    query = $controller("mockYTquery", {$scope: scope});
  
  }));

  it('should get toggled open when youTubeData executes a string query', function () {

    var sidenav, sidenavService, searchUrl, searchData, videoUrl, videoData;
 
    // Regular query search
    searchUrl = query.searchUrl.taylor_relev_any_page1;
    searchData = query.searchResponse.taylor_relev_any_page1;
    videoUrl = query.videoUrl.taylor_relev_any_page1;
    videoData = query.videoResponse.taylor_relev_any_page1;

    httpBackend.whenJSONP(searchUrl).respond(searchData);
    httpBackend.whenJSONP(videoUrl).respond(videoData);
   
    sidenav = angular.element('<md-sidenav md-component-id="search"></md-sidenav>');
    compile(sidenav)(scope);
    scope.$digest();

    dataAPI.query('taylor swift');
    httpBackend.flush();

    // Cannot spy on $mdSidnav('search').toggle
    // because we cannot pre-bind to the instance dynamically created in 
    // the event watch (?) . . . but 'exists' is added to the service in the 
    // same block, so we know it runs.
    expect(ctrl.mdSidenav.exists).not.toBeUndefined();

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
      expect(dataAPI.getRelatedVideos).toHaveBeenCalledWith(scope.video);

    });

    it('should not play the video when the related button is clicked,', function(){
      spyOn(playerAPI, 'load' );
      var related = searchItem.find(".searchRelatedIcon");
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
      thumbnail = searchItem.find(".searchItemClickArea");
      thumbnail.triggerHandler('click');
      expect(playerAPI.load).toHaveBeenCalledWith(scope.video);

    });

  });

  /*describe('search history option', function(){

    beforeEach(function(){
      scope.previous = {fake: ''};
      searchItem = angular.element('<md-option <embeditor-search-history-option video="video"></embeditor-search-item>');
      compile(searchItem)(scope);
      playerAPI.load = function(id){}; // Mock function, since API derived from YT Iframe
      scope.$digest();
    });*/

  

});
