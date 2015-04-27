'use strict';

/**
 * @ngdoc service
 * @name embeditor.youTubeDataAPI
 * @description
 * # youTubeDataAPI
 * Service in the embeditor.
 */
angular.module('embeditor')
  
.service('youTubeDataAPI', [ '$http', '$q', function($http, $q ){ 

    // -------------------- Private --------------------------
   // YOUTUBE / GOOGLE API ADRESSES & APP KEYS
   var youtube_api_key = 'AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE';
   var youtube_api_base_url_search = 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK'
   var youtube_api_base_url_videos = 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK'
   
   // MISC  
   var default_max_results = '40';
   var duplicates = []; // Array of id's maintained per search for detection of duplicate YT results
   var searchParameters = null; // Search params.
   var global_search_counter = 0; //Each new search gets id, checked to prevent concat of diff results on asynch return.
   
   var service = this;

   // ------------------------- Public ----------------------------- 

   // Data -- asynch: exposed through this.showResults()
   this.results = []; 

   // Input field 
   this.searchTerm = null; // String: The current search query.

   // Filter/Provider setters & values
   this.setSortOrder = null; // Method: defined below
   this.sortOrder = 'relevance'; // String: name of ordering, e.g. date, relevance etc.

   // Status vars for UI
   this.endOfResults = false; // Shows end of results message when results bottom out.
   this.failed = false; // Triggers failure message in lower menu area when no results are returned.
   this.firstPageLoading = false; // Triggers large spinner in lower menu area. 
   this.nextPageLoading = false; // Triggers small spinner in lower menu as vist-auto-load get more results

   // initSearch: Prep for any first search. 
   function initSearch(){

      //Initialize results & duplicates arrays, set 'End of Results' flag to false
      service.results = []; 
      service.endOfResults = false; 
      duplicates = []; 

      //Set search state flags, Increment search id counter
      service.firstPageLoading = true;
      service.failed = false;
      global_search_counter += 1; 

      // Default Parameters
      searchParameters = {
         q: '',
         order: service.sortOrder,
         part : 'snippet',
         type : 'video',
         maxResults : default_max_results,
         pageToken : '',      
         key : youtube_api_key
      };  
         
   };

   // Duration String Utilities
   String.prototype.toHHMMSS = function () {
      var d = parseInt(this, 10); // don't forget the second param
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);
      return ((h > 0 ? h + ':' : '') + (m > 0 ? (h > 0 && m < 10 ? '0' : '') + 
               m + ':' : '0:') + (s < 10 ? '0' : '') + s); 
   };

   // YT Time is ISO 8601: 
   //function formatYouTubeTime(time){
   //   return moment.isoDuration(time).asSeconds().toString().toHHMMSS();
   //}

   //  -------------------- Filter API  --------------------------

   // setSearchOrder: Verifies that filter value has changed
   // Changing search order automatically triggers an updated search.
   this.setSearchOrder = function(newOrder){

      if (service.sortOrder !== newOrder){
         service.sortOrder = newOrder;
         
         searchParameters.order = newOrder;
         searchParameters.pageToken = null;

         searchYouTube().then(function(){
            service.firstPageLoading = false; // Turn off spinner
         });
      }
   };

   //  -------------------- Search API  --------------------------
   this.query = function(searchTerm){
      console.log('Ran query: ' + searchTerm);
      initSearch();
      searchParameters.q = searchTerm;
      searchYouTube().then(function(){
         service.firstPageLoading = false; // Turn off spinner
      });
   };

   //getRelatedVideos: Called from vist-related-icon on click event
   this.getRelatedVideos = function(video){

      if (video){
         initSearch();
         searchParameters.relatedToVideoId = video.ref;
         searchYouTube().then(function(){
            service.firstPageLoading = false; // Turn off spinner
         });
      }
   };

   this.getChannelVideos = function(video){
      
      if (video.channelId){
         initSearch();
         searchParameters.channelId = video.channelId;
         searchYouTube().then(function(){
            service.firstPageLoading = false; // Turn off spinner
         });
      }
   };

   // 
   this.nextPage = function(){

      var deferred = $q.defer();

      if (!service.endOfResults){
         
         service.nextPageLoading = true;
         searchYouTube().then(function(){
            service.nextPageLoading = false; 
            deferred.resolve();
         });

      } else {
         deferred.resolve();
      }
      return deferred.promise;
   }

   // showResults: Exposes asynch results for ng-repeat, etc. . . 
   this.display = function(){
      return service.results;
   };

   // searchYouTube: Returns promise. Makes two calls - the first is a 
   // 'list' search, the second, compiled from results of the first, a 'video list'
   // search to get additional data about the videos like duration. Checks returned results
   // against current array to exclude duplicate records. Checks pagination tokens and sets 
   // this.endOfResults flag when last page is hit. Excludes unembeddable and non-public listings.
   function searchYouTube(){

      var deferred = $q.defer();
      
      // Temp parameters for second call based on first response
      var videoIdList = '';
      var parameters;
      var not_found = -1;
      var status; // Boolean is_embeddable, is_public (youtube API checks)

      // Counter to make sure we don't add results of a subsequent search executed while 
      // we waited for results to come back for this one. . . global_search_counter
      // incremented in initSearch();
      var local_search_counter = global_search_counter
                  
      // API CALL YT: #1   
      $http.jsonp(youtube_api_base_url_search, { params: searchParameters })
         .success(function(data_a) {
                               
            // Comma delimited list for videoId parameter 
            angular.forEach(data_a.items, function(item){
                  videoIdList = videoIdList + item.id.videoId + ',';
            });

            parameters = {
               part : 'snippet,contentDetails,status',
               id : videoIdList,
               type : 'video',
               key : youtube_api_key 
            };

            // CALL #2 
            $http.jsonp(youtube_api_base_url_videos, { params : parameters })
               .success(function(data) {  

               if (local_search_counter === global_search_counter){
                  angular.forEach(data.items, function(item){

                     status = (item.status.embeddable && (item.status.privacyStatus ==='public')); 
                     
                     //Only add unique items && viewable items
                     if ((duplicates.indexOf(item.id) === not_found) && status){

                        service.results.push({ 
                           title : item.snippet.title,
                           video_service_id: 1,
                           videoId : item.id,
                           //duration : formatYouTubeTime(item.contentDetails.duration),
                           url: 'http://www.youtube.com/watch?v=' + item.id,
                           imageUrl: item.snippet.thumbnails.default.url,
                           channelId: item.snippet.channelId,
                           channelTitle: item.snippet.channelTitle
                        });

                        duplicates.push(item.id);
                     }
                  });   

                  // Post message if search failed.
                  if (!service.results.length){
                      service.failed = true; 
                  }
                  // Extract next page token & Detect end of results
                  if (!data_a.nextPageToken){
                     service.endOfResults = true;
                  } else {
                     searchParameters.pageToken = data_a.nextPageToken;
                  }
               } 
               deferred.resolve();
                  
             });
      });
      return deferred.promise;
   };
  
}]);