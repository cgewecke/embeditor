(function () {
  'use strict'
/**
 * Retrieves search results from YouTube. Searches can be made by query string, channel, or 'related',
 * and filetered by duration, upload date and relevance.
 * @service youTubeDataAPI
 */
  angular.module('embeditor.services.youTubeDataAPI', []).service('youTubeDataAPI', youTubeDataAPI)

  function youTubeDataAPI ($http, $q, $rootScope) {
    // ------------------------------ Private ------------------------------------
    // YOUTUBE API ADRESSES & APP KEYS
    var youtubeApiKey = 'AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE' // FIX THIS!!!!
    var youtubeApiBaseUrlSearch = 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK'
    var youtubeApiBaseUrlVideos = 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK'

    // MISC
    var duplicates = []         // Array of id's maintained per search to detect duplicate results
    var searchParameters = null // Search params.
    var service = this
    var queryEvent = {name: 'youTubeDataAPI:query', query: ''}

    // ------------------------------ Public --------------------------------------

    this.results = []              // Data -- asynch: exposed through display()
    this.history = []              // Array of previous searches
    this.searchTerm = null         // String: The current search query.
    this.sortOrder = 'relevance'   // Name of ordering parameter: date, relevance.
    this.durationFilter = 'any'    // Name of duration filter param: any, short, long.
    this.maxResults = 40           // Passed to youtube to constrain size of return
    this.endOfResults = false      // Dom flag - end of results msg
    this.failed = false            // Dom flag - failure msg
    this.serverError = false       // Dom flag - server error msg
    this.firstPageLoading = false  // Dom flag - initial load msg
    this.nextPageLoading = false   // Dom flag - loading paginated rslts msg
    this.default_max_results = '30'

    // ------------------------------- Utilities ------------------------------------
    /**
     * Clears previous search results, reset all flags to initial state
     * @method  reset
     */
    function reset () {
      service.results = []
      service.endOfResults = false
      service.firstPageLoading = true
      service.failed = false
      service.serverError = false
      duplicates = []
    };
    /**
     * Preps for new query, related & channel searches.
     * @method initSearch
     */
    function initSearch () {
      reset()

        // Default Parameters
      searchParameters = {
        q: '',
        order: service.sortOrder,
        videoDuration: service.durationFilter,
        part: 'snippet',
        type: 'video',
        maxResults: service.default_max_results,
        pageToken: '',
        key: youtubeApiKey
      }
    };
    /**
     * Converts YouTube format time string to HH.MM.SS
     * @method  formatYouTubeTime
     * @param  {String} time ISO 8601
     * @return {String} HHMMSS
     */
    function formatYouTubeTime (time) {
      return moment.isoDuration(time).asSeconds().toString().toHHMMSS()
    }

    //  ------------------------------  Filter API  ------------------------------------
    /**
     * Verifies that sort order value has changed & updates search params.
     * New sort-orders will automatically re-run the current search with
     * the change.
     * @method  setSearchOrder
     * @param {String} newOrder     'relevance' OR 'date'
     */
    this.setSearchOrder = function (newOrder) {
      if (service.sortOrder !== newOrder) {
        service.sortOrder = newOrder
        searchParameters.order = newOrder
        searchParameters.pageToken = ''
        reset()

        searchYouTube().then(function () {
          service.firstPageLoading = false // Turn off spinner
        })
      }
    }

    /**
     * Verifies that duration filter value has changed & updates search params.
     * New duration selections will automatically re-run the current search with
     * the change.
     * @method  setDurationFilter
     * @param {String} newOrder     'any' OR 'short' OR 'long'
     */
    this.setDurationFilter = function (newDuration) {
      if (service.durationFilter !== newDuration) {
        service.durationFilter = newDuration
        searchParameters.videoDuration = newDuration
        searchParameters.pageToken = ''
        reset()

        searchYouTube().then(function () {
          service.firstPageLoading = false
        })
      }
    }

    //  ------------------------------  Search API  ------------------------------------
    /**
     * Runs a string query search and broadcasts a query event.
     * @method query
     * @param  {String} searchTerm [description]
     */
    this.query = function (searchTerm) {
      initSearch()
      searchParameters.q = searchTerm
      service.history.unshift({item: searchParameters.q, params: searchParameters})

      $rootScope.$broadcast(queryEvent.name, searchTerm)

      searchYouTube().then(function () {
        service.firstPageLoading = false
      })
    }
    /**
     * Runs a related videos search based on video's id.
     * @method getRelatedVideos
     * @param  {Object} video
     */
    this.getRelatedVideos = function (video) {
      if (video) {
        initSearch()
        searchParameters.relatedToVideoId = video.videoId
        service.history.unshift({item: 'Related: ' + video.title, params: searchParameters})
        searchYouTube().then(function () {
          service.firstPageLoading = false
        })
      }
    }
    /**
     * Runs a channel videos search based on video's channel id.
     * @method getChannelVideos
     * @param  {Object} video
     */
    this.getChannelVideos = function (video) {
      if (video.channelId) {
        initSearch()
        searchParameters.channelId = video.channelId
        service.history.unshift({item: 'Channel: ' + video.channelTitle, params: searchParameters})
        searchYouTube().then(function () {
          service.firstPageLoading = false
        })
      }
    }
    /**
     * Re-runs a search from the search history but keeps current filters/orders.
     * @method getAgain
     * @param  {Object} historyItem
     */
    this.getAgain = function (historyItem) {
      initSearch()
      searchParameters = historyItem.params
      searchParameters.order = service.sortOrder
      searchParameters.videoDuration = service.durationFilter
      searchParameters.pageToken = ''

      searchYouTube().then(function () {
        service.firstPageLoading = false
      })
    }
    /**
     * Runs a search for the next page of the current search
     * @method nextPage
     */
    this.nextPage = function () {
      if (!service.endOfResults) {
        service.nextPageLoading = true
        searchYouTube().then(function () {
          service.nextPageLoading = false
        })
      }
    }
    /**
     * Executes search. Makes two calls - the first is a 'list' search, the second, compiled from
     * results of the first, a 'video list' request to get additional data about the videos like duration.
     * Checks returned results against current array to exclude duplicate records. Checks pagination tokens
     * and sets endOfResults flag when last page is hit. Excludes unembeddable and non-public listings.
     * Sets serverFailure flag on call error, queryFailure flag when there are simply no results.
     * @searchYouTube
     * @return {Promise} Resolves when results are available.
     */
    function searchYouTube () {
      var deferred = $q.defer()

      // Temp parameters for second call based on first response
      var videoIdList = ''
      var parameters
      var notFound = -1
      var status // Boolean is_embeddable, is_public (youtube API checks)

      // API CALL YT: #1
      $http.jsonp(youtubeApiBaseUrlSearch, { params: searchParameters })
          .success(function (initialResults) {
              // Comma delimited list for videoId parameter
            angular.forEach(initialResults.items, function (item) {
              videoIdList = videoIdList + item.id.videoId + ','
            })

            parameters = {
              part: 'snippet,contentDetails,status',
              id: videoIdList,
              type: 'video',
              key: youtubeApiKey
            }

              // CALL #2
            $http.jsonp(youtubeApiBaseUrlVideos, { params: parameters })
                .success(function (data) {
                  angular.forEach(data.items, function (item) {
                    status = (item.status.embeddable && (item.status.privacyStatus === 'public'))

                        // Only add unique items && viewable items
                    if ((duplicates.indexOf(item.id) === notFound) && status) {
                      service.results.push({
                        title: item.snippet.title,
                        videoId: item.id,
                        seconds: moment.isoDuration(item.contentDetails.duration).asSeconds() - 2,
                        duration: formatYouTubeTime(item.contentDetails.duration),
                        publishedAt: moment(item.snippet.publishedAt).fromNow(),
                        imageUrl: item.snippet.thumbnails.medium.url,
                        channelId: item.snippet.channelId,
                        channelTitle: item.snippet.channelTitle
                      })
                      duplicates.push(item.id)
                    }
                  })

                  // Post message if search failed.
                  if (!service.results.length) {
                    service.failed = true
                  }
                  // Extract next page token & Detect end of results
                  (!initialResults.nextPageToken)
                    ? service.endOfResults = true
                    : searchParameters.pageToken = initialResults.nextPageToken

                  deferred.resolve()
                }
            ).error(function () { service.serverError = true })
          }
        ).error(function () { service.serverError = true })

      return deferred.promise
    };
  };
  youTubeDataAPI.$inject = ['$http', '$q', '$rootScope']
})()
