var yt_debug;
/**
 * @ngdoc service
 * @name embeditor.youTubeDataAPI
 * @description
 * # youTubeDataAPI
 * Service in the embeditor.
 */

(function(){ 

   'use strict';
   angular.module('embeditor.services.youTubeDataAPI', [])
      .service('youTubeDataAPI', youTubeDataAPI);
  
   function youTubeDataAPI($http, $q, $rootScope){

      // -------------------- Private --------------------------
      // YOUTUBE API ADRESSES & APP KEYS
      var youtube_api_key = 'AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE';
      var youtube_api_base_url_search = 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK'
      var youtube_api_base_url_videos = 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK'
      
      // MISC       
      var duplicates = []; // Array of id's maintained per search to detect duplicate results
      var searchParameters = null; // Search params.
      var service = this;

      // ------------------------- Public ----------------------------- 
      
      this.results = []; // Data -- asynch: exposed through display()
      this.history = []; // Array of previous searches
      this.searchTerm = null; // String: The current search query.
      this.sortOrder ='relevance';  // Name of ordering parameter: date, relevance.
      this.durationFilter='any'; // Name of duration filter param: any, short, long.
      this.maxResults = 40; // Passed to youtube to constrain size of return
      this.endOfResults = false; // Dom flag - end of results msg
      this.failed = false; // Dom flag - failure msg
      this.serverError = false; // Dom flag - server error msg
      this.firstPageLoading = false; // Dom flag - initial load msg
      this.nextPageLoading = false; // Dom flag - loading paginated rslts msg
      this.default_max_results = '30';
      
      // ------------------------- Published Events ----------------------------- 
      var queryEvent = {name: 'youTubeDataAPI:query', query: '' }; 

      // ------------------------- Helpers ----------------------------- 

      // Clear previous search results, reset all flags to initial state
      function reset(){
         service.results = [];
         service.endOfResults = false; 
         service.firstPageLoading = true;
         service.failed = false;
         service.serverError = false;
         duplicates = []; 
      };

      // initSearch: Prep for new query, related & channel searches. 
      function initSearch(){

         reset();

         // Default Parameters
         searchParameters = {
            q: '',
            order: service.sortOrder,
            videoDuration: service.durationFilter,
            part : 'snippet',
            type : 'video',
            maxResults : service.default_max_results,
            pageToken : '',      
            key : youtube_api_key
         };  
            
      };

      // Duration String Conversion Utilities
      String.prototype.toHHMMSS = function () {
         var d = parseInt(this, 10); // don't forget the second param
         var h = Math.floor(d / 3600);
         var m = Math.floor(d % 3600 / 60);
         var s = Math.floor(d % 3600 % 60);
         return ((h > 0 ? h + ':' : '') + (m > 0 ? (h > 0 && m < 10 ? '0' : '') + 
                  m + ':' : '0:') + (s < 10 ? '0' : '') + s); 
      };

      // YT Time is ISO 8601: 
      function formatYouTubeTime(time){
         return moment.isoDuration(time).asSeconds().toString().toHHMMSS();
      }

      //  -------------------- Public Filter API  --------------------------

      // These verify that filter value has changed & update params
      // New selections automatically re-run the current search with
      // the change
      this.setSearchOrder = function(newOrder){

         if (service.sortOrder !== newOrder){

            service.sortOrder = newOrder;
            searchParameters.order = newOrder;
            searchParameters.pageToken = '';
            reset();

            searchYouTube().then(function(){
               service.firstPageLoading = false; // Turn off spinner
            });
         }
      };

      this.setDurationFilter = function(newDuration){
         if (service.durationFilter !== newDuration){
            service.durationFilter = newDuration;
            searchParameters.videoDuration = newDuration;
            searchParameters.pageToken = '';
            reset();

            searchYouTube().then(function(){
               service.firstPageLoading = false; 
            });
         }
      };

      //  --------------------  Public Search API  --------------------------
      
      // Search by string query
      this.query = function(searchTerm){
         console.log('in query');
         initSearch();
         searchParameters.q = searchTerm;
         service.history.unshift({item: searchParameters.q, params: searchParameters });

         $rootScope.$broadcast(queryEvent.name, searchTerm);


         searchYouTube().then(function(){
            service.firstPageLoading = false; 
         });
      };

      // getRelatedVideos: Passes video ref id 
      // and retrieves related videos list
      this.getRelatedVideos = function(video){

         if (video){
            initSearch();
            searchParameters.relatedToVideoId = video.videoId;
            service.history.unshift({item: 'Related: ' + video.title, params: searchParameters });
            searchYouTube().then(function(){
               service.firstPageLoading = false; 
            });
         }
      };

      // getChannelVideos - passes video's channel id 
      // and retrieves channel's video list
      this.getChannelVideos = function(video){
         console.log('in channel');
         if (video.channelId){
            initSearch();
            searchParameters.channelId = video.channelId;
            service.history.unshift({item: 'Channel: ' + video.channelTitle, params: searchParameters })
            searchYouTube().then(function(){
               service.firstPageLoading = false; 
            });
         }
      };

      // getAgain - recalls w the parameters of a previous 
      // search, but keeps current filters/orders. Gets first page.
      this.getAgain = function(historyItem){
         
         initSearch();
         searchParameters = historyItem.params;
         searchParameters.order = service.sortOrder;
         searchParameters.videoDuration = service.durationFilter;
         searchParameters.pageToken='';

         searchYouTube().then(function(){
            service.firstPageLoading = false; 
         });
      }

      // nextPage: Each search subsequent to a new search collects
      // a next page token from the youtube response that gets added
      // to searchParameters. 
      this.nextPage = function(){

         if (!service.endOfResults){
            
            service.nextPageLoading = true;
            searchYouTube().then(function(){
               service.nextPageLoading = false; 
            });
         } 
      }
      // ------------------------- YouTubeDataAPI  ----------------------------- 

      // searchYouTube: Returns promise. Makes two calls - the first is a 
      // 'list' search, the second, compiled from results of the first, a 'video list'
      // request to get additional data about the videos like duration. Checks returned results
      // against current array to exclude duplicate records. Checks pagination tokens and sets 
      // endOfResults flag when last page is hit. Excludes unembeddable and non-public listings.
      // Sets serverFailure flag on call error, queryFailure flag when there are simply no results.
      function searchYouTube(){

         var deferred = $q.defer();

         // Temp parameters for second call based on first response
         var videoIdList = '';
         var parameters;
         var not_found = -1;
         var status; // Boolean is_embeddable, is_public (youtube API checks)
                     
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
              
                     angular.forEach(data.items, function(item){

                        status = (item.status.embeddable && (item.status.privacyStatus ==='public')); 
                        
                        //Only add unique items && viewable items
                        if ((duplicates.indexOf(item.id) === not_found) && status){

                           service.results.push({ 
                              title : item.snippet.title,
                              videoId : item.id,
                              duration : formatYouTubeTime(item.contentDetails.duration),
                              publishedAt: moment(item.snippet.publishedAt).fromNow(),
                              imageUrl: item.snippet.thumbnails.medium.url,
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
                     deferred.resolve(); 
                  }                   
               ).error(function(){
                  service.serverError = true;
               });
            }
         ).error(function(){
            service.serverError = true;
         });
         return deferred.promise;
      };
   };

   youTubeDataAPI.$inject = [ '$http', '$q', '$rootScope'];

})();