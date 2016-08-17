angular
  .module('yt.search.mockdata', [
  ])

   .controller('mockYTerror', function(){

    this.searchUrl = {
      gibberish: 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=&part=snippet&q=fjdksljfklds&type=video&videoDuration=any',
      lastResult: 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=&part=snippet&q=taylor&type=video&videoDuration=any',
      duplicate: '',
    }

    this.videoUrl = {
      gibberish: 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',
      lastResult: 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=-CmadmM5cOk,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',         
      duplicate: '',
    }

    this.searchResponse ={
      gibberish: {
         "kind": "youtube#searchListResponse",
         "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/ch5o1-GgrL0-e2Pm1ANpGUMA3yg\"",
         "pageInfo": {
          "totalResults": 0,
          "resultsPerPage": 1
         },
         "items": []
        },
      lastResult: {
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/B-HPR_Q5R8_SZKSSCn5DHT7GFBk\"",
           "prevPageToken": "CAEQAQ",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/7_1Y-nguh1PsKG0nmut7cLGdB8g\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "-CmadmM5cOk"
             },
             "snippet": {
              "publishedAt": "2015-02-13T13:20:01.000Z",
              "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
              "title": "Taylor Swift - Style",
              "description": "Check out Taylor's new stunning video for “Style\". Taylor's multi-platinum release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989.",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/-CmadmM5cOk/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/-CmadmM5cOk/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/-CmadmM5cOk/hqdefault.jpg"
               }
              },
              "channelTitle": "TaylorSwiftVEVO",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
           
      duplicate:{}
    };

    this.videoResponse = {
      gibberish: {
         "kind": "youtube#videoListResponse",
         "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/ZY3wE9w2mY5hUZsOv09Br9NhOXY\"",
         "pageInfo": {
          "totalResults": 0,
          "resultsPerPage": 0
         },
         "items": []
        },
      lastResult:{
          "kind": "youtube#videoListResponse",
          "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/2p_U5Xv1cD1jql0lhByfzh36D5w\"",
          "pageInfo": {
           "totalResults": 1,
           "resultsPerPage": 1
          },
          "items": [
           {
            "kind": "youtube#video",
            "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/GDm_FKp3v9Hdl2galKhv5kFf_do\"",
            "id": "-CmadmM5cOk",
            "snippet": {
             "publishedAt": "2015-02-13T13:20:01.000Z",
             "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
             "title": "Taylor Swift - Style",
             "description": "Check out Taylor's new stunning video for “Style\". Taylor’s multi-platinum release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989.",
             "thumbnails": {
              "default": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/default.jpg",
               "width": 120,
               "height": 90
              },
              "medium": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/mqdefault.jpg",
               "width": 320,
               "height": 180
              },
              "high": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/hqdefault.jpg",
               "width": 480,
               "height": 360
              },
              "standard": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/sddefault.jpg",
               "width": 640,
               "height": 480
              },
              "maxres": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/maxresdefault.jpg",
               "width": 1280,
               "height": 720
              }
             },
             "channelTitle": "TaylorSwiftVEVO",
             "categoryId": "10",
             "liveBroadcastContent": "none",
             "localized": {
              "title": "Taylor Swift - Style",
              "description": "Check out Taylor's new stunning video for “Style\". Taylor’s multi-platinum release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989."
             }
            },
            "contentDetails": {
             "duration": "PT4M4S",
             "dimension": "2d",
             "definition": "hd",
             "caption": "false",
             "licensedContent": true,
             "regionRestriction": {
              "blocked": [
               "DE"
              ]
             }
            },
            "status": {
             "uploadStatus": "processed",
             "privacyStatus": "public",
             "license": "youtube",
             "embeddable": true,
             "publicStatsViewable": true
            }
           }
          ]
         },
          
      duplicate:{}
    };

   })
   .controller('mockYTquery', function(){


      this.searchUrl = {
         taylor_relev_any_page1 : 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=&part=snippet&q=taylor+swift&type=video&videoDuration=any',
         taylor_relev_any_page2 : 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=CAEQAA&part=snippet&q=taylor+swift&type=video&videoDuration=any',
         taylor_date_any_page1 : 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=date&pageToken=&part=snippet&q=taylor+swift&type=video&videoDuration=any',
         taylor_date_any_page2 : 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=date&pageToken=CAEQAA&part=snippet&q=taylor+swift&type=video&videoDuration=any',
         taylor_relev_short_page1 : 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=&part=snippet&q=taylor+swift&type=video&videoDuration=short',
         taylor_relev_short_page2 : 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=CAEQAA&part=snippet&q=taylor+swift&type=video&videoDuration=short',
         taylor_relev_long_page1 : 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=&part=snippet&q=taylor+swift&type=video&videoDuration=long'
      }

      this.searchResponse = {
         taylor_relev_any_page1 : {
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/kHFlEvu_76T7ixct70XMvDxducs\"",
           "nextPageToken": "CAEQAA",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/nCmRcNsJEwUGBA-5kEg5z0WkdMY\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "e-ORhEE9VVg"
             },
             "snippet": {
              "publishedAt": "2014-11-10T17:05:44.000Z",
              "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
              "title": "Taylor Swift - Blank Space",
              "description": "Watch Taylor's new video for \"Blank Space\". No animals, trees, automobiles or actors were harmed in the making of this video. Taylor's new release 1989 is ...",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg"
               }
              },
              "channelTitle": "TaylorSwiftVEVO",
              "liveBroadcastContent": "none"
             }
            }
           ]
          } ,
         taylor_relev_any_page2 :{
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/B-HPR_Q5R8_SZKSSCn5DHT7GFBk\"",
           "nextPageToken": "CAIQAA",
           "prevPageToken": "CAEQAQ",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/7_1Y-nguh1PsKG0nmut7cLGdB8g\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "-CmadmM5cOk"
             },
             "snippet": {
              "publishedAt": "2015-02-13T13:20:01.000Z",
              "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
              "title": "Taylor Swift - Style",
              "description": "Check out Taylor's new stunning video for “Style\". Taylor's multi-platinum release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989.",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/-CmadmM5cOk/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/-CmadmM5cOk/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/-CmadmM5cOk/hqdefault.jpg"
               }
              },
              "channelTitle": "TaylorSwiftVEVO",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
         taylor_date_any_page1 : {
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/058WStr9Pa3j2uN5BRv1uOBFhAs\"",
           "nextPageToken": "CAEQAA",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/oRAa4Mn-748igCkOcF2wgB-xuFk\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "tuT13e7Jzwg"
             },
             "snippet": {
              "publishedAt": "2015-05-02T17:15:13.000Z",
              "channelId": "UCiW0Vjw_tP8Gf7JnLJVBviA",
              "title": "\"Taylor swift ❤️❤️\" Beundrarvideo",
              "description": "Fan video av \"Taylor swift ❤️❤️\" Skapad med Video Star: http://VideoStarApp.com/FREE.",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/tuT13e7Jzwg/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/tuT13e7Jzwg/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/tuT13e7Jzwg/hqdefault.jpg"
               }
              },
              "channelTitle": "",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
         taylor_date_any_page2 :{
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/9AynSzSTVRJi9J7QUHyDQ29QWB8\"",
           "nextPageToken": "CAIQAA",
           "prevPageToken": "CAEQAQ",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/78mjHbCbKJBLaYtPzNrsIgNkMlM\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "j7boK4VMcmg"
             },
             "snippet": {
              "publishedAt": "2015-05-02T17:11:58.000Z",
              "channelId": "UCxfZ8GBjDEUAUlTXKZAP_7Q",
              "title": "Taylor Swift~~Blank Space~ Chipmunks",
              "description": "",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/j7boK4VMcmg/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/j7boK4VMcmg/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/j7boK4VMcmg/hqdefault.jpg"
               }
              },
              "channelTitle": "",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
         taylor_relev_short_page1 : {
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/900hous6CwPDMN0bXacqaI58If4\"",
           "nextPageToken": "CAEQAA",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/WijH3kkvjLj3rgoL3il7OP0q4WY\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "8-rh6xb5gZE"
             },
             "snippet": {
              "publishedAt": "2015-05-01T18:00:00.000Z",
              "channelId": "UCvVq8bEmY431dorJsjQn7Rw",
              "title": "Hilary Duff’s ‘Sparks’ Vs Taylor Swift ‘Sparks Fly’: Song Showdown!",
              "description": "Hilary Duff's 'Sparks' Vs Taylor Swift 'Sparks Fly': Song Showdown! Subscribe to Hollywire | http://bit.ly/Sub2HotMinute Send Chelsea a Tweet!",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/8-rh6xb5gZE/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/8-rh6xb5gZE/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/8-rh6xb5gZE/hqdefault.jpg"
               }
              },
              "channelTitle": "HollywireTV",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
         taylor_relev_short_page2 :{
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/q4TrYDlFi-LEvIpCB8m8wa4YuR8\"",
           "nextPageToken": "CAIQAA",
           "prevPageToken": "CAEQAQ",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/02J9gO6NQz4JXM6ZRz7J_lQ5YHg\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "VuNIsY6JdUw"
             },
             "snippet": {
              "publishedAt": "2009-06-16T22:02:30.000Z",
              "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
              "title": "Taylor Swift - You Belong With Me",
              "description": "Music video by Taylor Swift performing You Belong With Me. (C) 2009 Big Machine Records, LLC #VEVOCertified on April 16, 2011.",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/hqdefault.jpg"
               }
              },
              "channelTitle": "TaylorSwiftVEVO",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
         taylor_relev_long_page1 : {
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/wpp7qtcCIg9cdMx0n5YCA0LRYEk\"",
           "nextPageToken": "CAEQAA",
           "pageInfo": {
            "totalResults": 1000000,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/zxFlGgmhK6hcaODj4v5HIllnsHY\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "fbTZkuPqL-A"
             },
             "snippet": {
              "publishedAt": "2015-05-02T01:00:01.000Z",
              "channelId": "UCv7YFWATebnJ1ty4cwMKgsQ",
              "title": "Taylor Swift Doesn't Fit In",
              "description": "Taylor Swift reportedly doesn't fit in with Calvin Harris' friends. Is it important to get along with your boyfriend's friends?",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/fbTZkuPqL-A/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/fbTZkuPqL-A/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/fbTZkuPqL-A/hqdefault.jpg"
               }
              },
              "channelTitle": "WendyWilliamsShow",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
      };
      this.videoUrl = {
         taylor_relev_any_page1 : 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=e-ORhEE9VVg,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',         
         taylor_relev_any_page2 :'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=-CmadmM5cOk,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',         
         taylor_date_any_page1 :'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=tuT13e7Jzwg,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',         
         taylor_date_any_page2 :'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=911XehZ1oK8,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',        
         taylor_relev_short_page1 :'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=8-rh6xb5gZE,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',       
         taylor_relev_short_page2 :'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=67WUwWZsV-w,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',        
         taylor_relev_long_page1 : 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=RK4ANiZLJyQ,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video'
      };


      this.videoResponse = {
         taylor_relev_any_page1 : {
          "kind": "youtube#videoListResponse",
          "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/bvYgKb7N2MFU2g2C0ArbF5AtWYQ\"",
          "pageInfo": {
           "totalResults": 1,
           "resultsPerPage": 1
          },
          "items": [
           {
            "kind": "youtube#video",
            "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/EbJAqq7IwUbiwpbzhb9dgnQEzJE\"",
            "id": "e-ORhEE9VVg",
            "snippet": {
             "publishedAt": "2014-11-10T17:05:44.000Z",
             "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
             "title": "Taylor Swift - Blank Space",
             "description": "Watch Taylor's new video for \"Blank Space\".  No animals, trees, automobiles or actors were harmed in the making of this video.  Taylor’s new release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989.",
             "thumbnails": {
              "default": {
               "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/default.jpg",
               "width": 120,
               "height": 90
              },
              "medium": {
               "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg",
               "width": 320,
               "height": 180
              },
              "high": {
               "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg",
               "width": 480,
               "height": 360
              },
              "standard": {
               "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/sddefault.jpg",
               "width": 640,
               "height": 480
              },
              "maxres": {
               "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/maxresdefault.jpg",
               "width": 1280,
               "height": 720
              }
             },
             "channelTitle": "TaylorSwiftVEVO",
             "categoryId": "10",
             "liveBroadcastContent": "none",
             "localized": {
              "title": "Taylor Swift - Blank Space",
              "description": "Watch Taylor's new video for \"Blank Space\".  No animals, trees, automobiles or actors were harmed in the making of this video.  Taylor’s new release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989."
             }
            },
            "contentDetails": {
             "duration": "PT4M33S",
             "dimension": "2d",
             "definition": "hd",
             "caption": "false",
             "licensedContent": true
            },
            "status": {
             "uploadStatus": "processed",
             "privacyStatus": "public",
             "license": "youtube",
             "embeddable": true,
             "publicStatsViewable": true
            }
           }
          ]
         },         
         taylor_relev_any_page2 : {
          "kind": "youtube#videoListResponse",
          "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/2p_U5Xv1cD1jql0lhByfzh36D5w\"",
          "pageInfo": {
           "totalResults": 1,
           "resultsPerPage": 1
          },
          "items": [
           {
            "kind": "youtube#video",
            "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/GDm_FKp3v9Hdl2galKhv5kFf_do\"",
            "id": "-CmadmM5cOk",
            "snippet": {
             "publishedAt": "2015-02-13T13:20:01.000Z",
             "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
             "title": "Taylor Swift - Style",
             "description": "Check out Taylor's new stunning video for “Style\". Taylor’s multi-platinum release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989.",
             "thumbnails": {
              "default": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/default.jpg",
               "width": 120,
               "height": 90
              },
              "medium": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/mqdefault.jpg",
               "width": 320,
               "height": 180
              },
              "high": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/hqdefault.jpg",
               "width": 480,
               "height": 360
              },
              "standard": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/sddefault.jpg",
               "width": 640,
               "height": 480
              },
              "maxres": {
               "url": "https://i.ytimg.com/vi/-CmadmM5cOk/maxresdefault.jpg",
               "width": 1280,
               "height": 720
              }
             },
             "channelTitle": "TaylorSwiftVEVO",
             "categoryId": "10",
             "liveBroadcastContent": "none",
             "localized": {
              "title": "Taylor Swift - Style",
              "description": "Check out Taylor's new stunning video for “Style\". Taylor’s multi-platinum release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989."
             }
            },
            "contentDetails": {
             "duration": "PT4M4S",
             "dimension": "2d",
             "definition": "hd",
             "caption": "false",
             "licensedContent": true,
             "regionRestriction": {
              "blocked": [
               "DE"
              ]
             }
            },
            "status": {
             "uploadStatus": "processed",
             "privacyStatus": "public",
             "license": "youtube",
             "embeddable": true,
             "publicStatsViewable": true
            }
           }
          ]
         },         
         taylor_date_any_page1 :{
          "kind": "youtube#videoListResponse",
          "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/tFzIxgCDHuH75eVj1R9fV7q2E-U\"",
          "pageInfo": {
           "totalResults": 1,
           "resultsPerPage": 1
          },
          "items": [
           {
            "kind": "youtube#video",
            "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/Xf0n8RPFFjgjqr-RdF2MfsZR_J4\"",
            "id": "GW9xslkYtoQ",
            "snippet": {
             "publishedAt": "2015-05-01T20:59:35.000Z",
             "channelId": "UCn-3VwcAIB79PVn31SqXEiw",
             "title": "Fifteen by Taylor Swift (Nicole Joann cover)",
             "description": "",
             "thumbnails": {
              "default": {
               "url": "https://i.ytimg.com/vi/GW9xslkYtoQ/default.jpg",
               "width": 120,
               "height": 90
              },
              "medium": {
               "url": "https://i.ytimg.com/vi/GW9xslkYtoQ/mqdefault.jpg",
               "width": 320,
               "height": 180
              },
              "high": {
               "url": "https://i.ytimg.com/vi/GW9xslkYtoQ/hqdefault.jpg",
               "width": 480,
               "height": 360
              }
             },
             "channelTitle": "NicoleJoannMusic",
             "categoryId": "10",
             "liveBroadcastContent": "none",
             "localized": {
              "title": "Fifteen by Taylor Swift (Nicole Joann cover)",
              "description": ""
             }
            },
            "contentDetails": {
             "duration": "PT5M30S",
             "dimension": "2d",
             "definition": "hd",
             "caption": "false",
             "licensedContent": false
            },
            "status": {
             "uploadStatus": "processed",
             "privacyStatus": "public",
             "license": "youtube",
             "embeddable": true,
             "publicStatsViewable": true
            }
           }
          ]
         },         
         taylor_date_any_page2 : {
          "kind": "youtube#videoListResponse",
          "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/04Z4W6LT9QYMQJhGhjvk1gODLMM\"",
          "pageInfo": {
           "totalResults": 1,
           "resultsPerPage": 1
          },
          "items": [
           {
            "kind": "youtube#video",
            "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/MQwcAaMCRPp0DS-Xv53OZ9wwN6E\"",
            "id": "911XehZ1oK8",
            "snippet": {
             "publishedAt": "2015-05-01T20:56:05.000Z",
             "channelId": "UCRToEivGOwZEEumfi4RP53A",
             "title": "Taylor Swift - Blank Space",
             "description": "Jewels, garters, chokers. The accessories list goes on and on! Watch as Tyler gets bedazzled by Charolette, the Vegas wedding extraordinaire. Watch Full Episodes Only On TheScene: .\r\n\r\nWatch Taylor's new video for Blank Space. No animals, trees, automobiles or actors were harmed in the making of this video. Taylor's new release 1989 is Available Now on iTunes .\r\n\r\nI just want to upload something well here is my part for the the Dress up Mep =3 Song: Dressing up Artist: Its a cover version(?) from Katy Perry Studio:",
             "thumbnails": {
              "default": {
               "url": "https://i.ytimg.com/vi/911XehZ1oK8/default.jpg",
               "width": 120,
               "height": 90
              },
              "medium": {
               "url": "https://i.ytimg.com/vi/911XehZ1oK8/mqdefault.jpg",
               "width": 320,
               "height": 180
              },
              "high": {
               "url": "https://i.ytimg.com/vi/911XehZ1oK8/hqdefault.jpg",
               "width": 480,
               "height": 360
              },
              "standard": {
               "url": "https://i.ytimg.com/vi/911XehZ1oK8/sddefault.jpg",
               "width": 640,
               "height": 480
              },
              "maxres": {
               "url": "https://i.ytimg.com/vi/911XehZ1oK8/maxresdefault.jpg",
               "width": 1280,
               "height": 720
              }
             },
             "channelTitle": "Eldridge Shela",
             "categoryId": "24",
             "liveBroadcastContent": "none",
             "localized": {
              "title": "Taylor Swift - Blank Space",
              "description": "Jewels, garters, chokers. The accessories list goes on and on! Watch as Tyler gets bedazzled by Charolette, the Vegas wedding extraordinaire. Watch Full Episodes Only On TheScene: .\r\n\r\nWatch Taylor's new video for Blank Space. No animals, trees, automobiles or actors were harmed in the making of this video. Taylor's new release 1989 is Available Now on iTunes .\r\n\r\nI just want to upload something well here is my part for the the Dress up Mep =3 Song: Dressing up Artist: Its a cover version(?) from Katy Perry Studio:"
             }
            },
            "contentDetails": {
             "duration": "PT2M51S",
             "dimension": "2d",
             "definition": "hd",
             "caption": "false",
             "licensedContent": false
            },
            "status": {
             "uploadStatus": "processed",
             "privacyStatus": "public",
             "license": "youtube",
             "embeddable": true,
             "publicStatsViewable": true
            }
           }
          ]
         },        
         taylor_relev_short_page1 : {
          "kind": "youtube#videoListResponse",
          "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/aK5kD8cTDV4XbTOGesVnhY7VWFw\"",
          "pageInfo": {
           "totalResults": 1,
           "resultsPerPage": 1
          },
          "items": [
           {
            "kind": "youtube#video",
            "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/LHdgAiroV5J3WmTMptfWs9hb-yU\"",
            "id": "VuNIsY6JdUw",
            "snippet": {
             "publishedAt": "2009-06-16T21:07:24.000Z",
             "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
             "title": "Taylor Swift - You Belong With Me",
             "description": "Music video by Taylor Swift performing You Belong With Me. (C) 2009 Big Machine Records, LLC\n#VEVOCertified on April 16, 2011. http://www.vevo.com/certified http://www.youtube.com/vevocertified",
             "thumbnails": {
              "default": {
               "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/default.jpg",
               "width": 120,
               "height": 90
              },
              "medium": {
               "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/mqdefault.jpg",
               "width": 320,
               "height": 180
              },
              "high": {
               "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/hqdefault.jpg",
               "width": 480,
               "height": 360
              },
              "standard": {
               "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/sddefault.jpg",
               "width": 640,
               "height": 480
              },
              "maxres": {
               "url": "https://i.ytimg.com/vi/VuNIsY6JdUw/maxresdefault.jpg",
               "width": 1280,
               "height": 720
              }
             },
             "channelTitle": "TaylorSwiftVEVO",
             "categoryId": "10",
             "liveBroadcastContent": "none",
             "localized": {
              "title": "Taylor Swift - You Belong With Me",
              "description": "Music video by Taylor Swift performing You Belong With Me. (C) 2009 Big Machine Records, LLC\n#VEVOCertified on April 16, 2011. http://www.vevo.com/certified http://www.youtube.com/vevocertified"
             }
            },
            "contentDetails": {
             "duration": "PT3M49S",
             "dimension": "2d",
             "definition": "sd",
             "caption": "false",
             "licensedContent": true,
             "regionRestriction": {
              "blocked": [
               "DE"
              ]
             }
            },
            "status": {
             "uploadStatus": "processed",
             "privacyStatus": "public",
             "license": "youtube",
             "embeddable": true,
             "publicStatsViewable": true
            }
           }
          ]
         },       
         taylor_relev_short_page2 : {
          "kind": "youtube#videoListResponse",
          "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/bZkh-eICJrHYbRXEFI8Ra7SxktU\"",
          "pageInfo": {
           "totalResults": 1,
           "resultsPerPage": 1
          },
          "items": [
           {
            "kind": "youtube#video",
            "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/mpN2qz3csM1eaMru4WjQggfjnF0\"",
            "id": "67WUwWZsV-w",
            "snippet": {
             "publishedAt": "2015-04-30T17:19:09.000Z",
             "channelId": "UCVr-TwiGNnveWyOouIyz2fQ",
             "title": "Why Taylor Swift Assumes the Role of Booking Agent When She’s on Tour",
             "description": "Taylor Swift is hitting the road! Swift, who will kick off her 1989 World Tour next week in Tokyo, sat down with “Extra’s” special correspondent Alecia Davis today to dish on what fans can expect.",
             "thumbnails": {
              "default": {
               "url": "https://i.ytimg.com/vi/67WUwWZsV-w/default.jpg",
               "width": 120,
               "height": 90
              },
              "medium": {
               "url": "https://i.ytimg.com/vi/67WUwWZsV-w/mqdefault.jpg",
               "width": 320,
               "height": 180
              },
              "high": {
               "url": "https://i.ytimg.com/vi/67WUwWZsV-w/hqdefault.jpg",
               "width": 480,
               "height": 360
              },
              "standard": {
               "url": "https://i.ytimg.com/vi/67WUwWZsV-w/sddefault.jpg",
               "width": 640,
               "height": 480
              },
              "maxres": {
               "url": "https://i.ytimg.com/vi/67WUwWZsV-w/maxresdefault.jpg",
               "width": 1280,
               "height": 720
              }
             },
             "channelTitle": "extratv",
             "categoryId": "24",
             "liveBroadcastContent": "none",
             "localized": {
              "title": "Why Taylor Swift Assumes the Role of Booking Agent When She’s on Tour",
              "description": "Taylor Swift is hitting the road! Swift, who will kick off her 1989 World Tour next week in Tokyo, sat down with “Extra’s” special correspondent Alecia Davis today to dish on what fans can expect."
             }
            },
            "contentDetails": {
             "duration": "PT3M1S",
             "dimension": "2d",
             "definition": "hd",
             "caption": "false",
             "licensedContent": true
            },
            "status": {
             "uploadStatus": "processed",
             "privacyStatus": "public",
             "license": "youtube",
             "embeddable": true,
             "publicStatsViewable": true
            }
           }
          ]
         },        
         taylor_relev_long_page1 : {
       "kind": "youtube#videoListResponse",
       "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/5saRPHu3gD6im_1M7LsbuwLBt4o\"",
       "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 1
       },
       "items": [
        {
         "kind": "youtube#video",
         "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/5rtBwdTkbaEhcKzBy4bn-qomfeg\"",
         "id": "RK4ANiZLJyQ",
         "snippet": {
          "publishedAt": "2015-03-29T19:22:51.000Z",
          "channelId": "UC8ii4__VslLqFQkzVM_-o7Q",
          "title": "Taylor Swift รวมเพลงเพราะๆ | Best songs of Taylor Swift★Greatest Hits 2015",
          "description": "DISCLAIMER: We do not own this audio. All rights belong to its rightful owner. This clip is (C) copyright.\n\n=====================\nTaylor Swift รวมเพลงเพราะๆ | Best songs of Taylor Swift★Greatest Hits 2015\n=====================\n__List:__\n\n1. You Belong With Me 00:00\n2. Love Story 03:51\n3. We Are Never Ever Getting Back Together 07:48\n4. I Knew You Were Trouble 11:01\n5. Safe & Sound 14:41\n6. 22 18:43\n7. Mine 22:35\n8. Everything Has Changed 26:27\n9. Red 30:32\n10. Our Song 34:16\n11. Mean 37:38\n12. Back To December 41:36\n13. Begin Again 46:31\n14. White Horse 50:29\n15. The Story Of Us 54:24\n16. Teardrops On My Guitar 58:59\n17. Fifteen 1:02:30\n18. Picture To Burn 1:07:25\n19. Tim McGraw 1:10:22\n20. Should've Said No 1:14:19\n21. Sweeter Than Fiction 1:18:25\n22. Sparks Fly 1:22:20\n23. Change 1:26:43\n24. Fearless 1:31:24\n25. Eyes Open 1:39:27",
          "thumbnails": {
           "default": {
            "url": "https://i.ytimg.com/vi/RK4ANiZLJyQ/default.jpg",
            "width": 120,
            "height": 90
           },
           "medium": {
            "url": "https://i.ytimg.com/vi/RK4ANiZLJyQ/mqdefault.jpg",
            "width": 320,
            "height": 180
           },
           "high": {
            "url": "https://i.ytimg.com/vi/RK4ANiZLJyQ/hqdefault.jpg",
            "width": 480,
            "height": 360
           }
          },
          "channelTitle": "Sl2lan ฟังเพลงเพราะๆ",
          "categoryId": "22",
          "liveBroadcastContent": "none",
          "localized": {
           "title": "Taylor Swift รวมเพลงเพราะๆ | Best songs of Taylor Swift★Greatest Hits 2015",
           "description": "DISCLAIMER: We do not own this audio. All rights belong to its rightful owner. This clip is (C) copyright.\n\n=====================\nTaylor Swift รวมเพลงเพราะๆ | Best songs of Taylor Swift★Greatest Hits 2015\n=====================\n__List:__\n\n1. You Belong With Me 00:00\n2. Love Story 03:51\n3. We Are Never Ever Getting Back Together 07:48\n4. I Knew You Were Trouble 11:01\n5. Safe & Sound 14:41\n6. 22 18:43\n7. Mine 22:35\n8. Everything Has Changed 26:27\n9. Red 30:32\n10. Our Song 34:16\n11. Mean 37:38\n12. Back To December 41:36\n13. Begin Again 46:31\n14. White Horse 50:29\n15. The Story Of Us 54:24\n16. Teardrops On My Guitar 58:59\n17. Fifteen 1:02:30\n18. Picture To Burn 1:07:25\n19. Tim McGraw 1:10:22\n20. Should've Said No 1:14:19\n21. Sweeter Than Fiction 1:18:25\n22. Sparks Fly 1:22:20\n23. Change 1:26:43\n24. Fearless 1:31:24\n25. Eyes Open 1:39:27"
          }
         },
         "contentDetails": {
          "duration": "PT1H39M49S",
          "dimension": "2d",
          "definition": "hd",
          "caption": "false",
          "licensedContent": false,
          "regionRestriction": {
           "blocked": [
            "DE"
           ]
          }
         },
         "status": {
          "uploadStatus": "processed",
          "privacyStatus": "public",
          "license": "youtube",
          "embeddable": true,
          "publicStatsViewable": true
         }
        }
       ]
      }};

      this.output = {

         taylor_relev_any_page1 :[
         {
            title: "Taylor Swift - Blank Space",
            videoId: "e-ORhEE9VVg",
            duration: "4:33",
            seconds: 271,
            publishedAt: moment("2014-11-10T17:05:44.000Z").fromNow(), //"7 months ago",
            imageUrl: "https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg",
            channelId: "UCANLZYMidaCbLQFWXBC95Jg",
            channelTitle: "TaylorSwiftVEVO",
         }],
         taylor_relev_any_page2 : [
         {
            channelId: "UCANLZYMidaCbLQFWXBC95Jg",
            channelTitle: "TaylorSwiftVEVO",
            duration: "4:33",
            seconds: 271,
            imageUrl: "https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg",
            publishedAt: "7 months ago",
            title: "Taylor Swift - Blank Space",
            videoId: "e-ORhEE9VVg",
         }, 
         {
            channelId: "UCANLZYMidaCbLQFWXBC95Jg",
            channelTitle: "TaylorSwiftVEVO",
            duration: "4:04",
            seconds: 242,
            imageUrl: "https://i.ytimg.com/vi/-CmadmM5cOk/mqdefault.jpg",
            publishedAt: moment("2015-02-13T13:20:01.000Z").fromNow(), //"4 months ago",
            title: "Taylor Swift - Style",
            videoId: "-CmadmM5cOk",
         }],
         taylor_date_any_page1 : [
         {
            channelId: "UCaGNEH8ZIy64a7hk5-55Zow",
            channelTitle: "kristine mamisao",
            duration: "3:10",
            imageUrl: "https://i.ytimg.com/vi/0As-CrUU7ak/mqdefault.jpg",
            publishedAt: "11 minutes ago",
            title: "Style -Taylor Swift - Cover",
            videoId: "0As-CrUU7ak",
         }],
         taylor_date_any_page2 : [
         {
            channelId: "UCaGNEH8ZIy64a7hk5-55Zow",
            channelTitle: "kristine mamisao",
            duration: "3:10",
            imageUrl: "https://i.ytimg.com/vi/0As-CrUU7ak/mqdefault.jpg",
            publishedAt: "11 minutes ago",
            title: "Style -Taylor Swift - Cover",
            videoId: "0As-CrUU7ak"
         },
         {
            channelId: "UCTula9ngCIYRlv-fFd-l3Zw",
            channelTitle: "LiKe AqUí",
            duration: "3:52",
            imageUrl: "https://i.ytimg.com/vi/in3WVdkeSmk/mqdefault.jpg",
            publishedAt: "3 minutes ago",
            title: "Taylor Swift - Blank Space ★ (Official Video) Subtitulado Español HD",
            videoId: "in3WVdkeSmk",
         }],
         taylor_relev_short_page1 : [
         {
            channelId: "UCVr-TwiGNnveWyOouIyz2fQ",
            channelTitle: "extratv",
            duration: "3:01",
            imageUrl: "https://i.ytimg.com/vi/67WUwWZsV-w/mqdefault.jpg",
            publishedAt: "a day ago",
            title: "Why Taylor Swift Assumes the Role of Booking Agent When She’s on Tour",
            videoId: "67WUwWZsV-w"
         }],

         taylor_relev_short_page2 : [{
            channelId: "UCVr-TwiGNnveWyOouIyz2fQ",
            channelTitle: "extratv",
            duration: "3:01",
            imageUrl: "https://i.ytimg.com/vi/67WUwWZsV-w/mqdefault.jpg",
            publishedAt: "a day ago",
            title: "Why Taylor Swift Assumes the Role of Booking Agent When She’s on Tour",
            videoId: "67WUwWZsV-w"
         },
         {
            channelId: "UCANLZYMidaCbLQFWXBC95Jg",
            channelTitle: "TaylorSwiftVEVO",
            duration: "3:49",
            imageUrl: "https://i.ytimg.com/vi/VuNIsY6JdUw/mqdefault.jpg",
            publishedAt: "6 years ago",
            title: "Taylor Swift - You Belong With Me",
            videoId: "VuNIsY6JdUw"

         }],
         taylor_relev_long_page1 : [{
            channelId: "UC8ii4__VslLqFQkzVM_-o7Q",
            channelTitle: "Sl2lan ฟังเพลงเพราะๆ",
            duration: "1:39:49",
            imageUrl: "https://i.ytimg.com/vi/RK4ANiZLJyQ/mqdefault.jpg",
            publishedAt: "a month ago",
            title: "Taylor Swift รวมเพลงเพราะๆ | Best songs of Taylor Swift★Greatest Hits 2015",
            videoId: "RK4ANiZLJyQ"
         }],
      };
   })

   .controller('mockYTchannel', function(){


      this.searchUrl = {
        yale_relev_any_page1: 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&channelId=UC4EY_qnSeAP1xGsh61eOoJA&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=&part=snippet&q=&type=video&videoDuration=any',
        yale_relev_any_page2: 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&channelId=UC4EY_qnSeAP1xGsh61eOoJA&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=CAEQAA&part=snippet&q=&type=video&videoDuration=any'
      };

      this.videoUrl = {
         yale_relev_any_page1: 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=7emS3ye3cVU,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',
         yale_relev_any_page2: 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=2B9b9mUPJik,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video' 
      };

      this.videoResponse ={
         yale_relev_any_page1: {
          "kind": "youtube#videoListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/Q0yareeXS4evV8G-HGiL0NoIMac\"",
           "pageInfo": {
            "totalResults": 1,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#video",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/bYzamuueklTCUJNwj2nCynT116k\"",
             "id": "7emS3ye3cVU",
             "snippet": {
              "publishedAt": "2008-09-30T17:56:52.000Z",
              "channelId": "UC4EY_qnSeAP1xGsh61eOoJA",
              "title": "3. Foundations: Freud",
              "description": "Introduction to Psychology (PSYC 110)\n\nThis lecture introduces students to the theories of Sigmund Freud, including a brief biographical description and his contributions to the field of psychology. The limitations of his theories of psychoanalysis are covered in detail, as well as the ways in which his conception of the unconscious mind still operate in mainstream psychology today.\n\n00:00 - Chapter 1. Sigmund Freud in a Historical Context\n06:51 - Chapter 2. Unconscious Motivation: The Id, Ego and Superego\n13:45 - Chapter 3. Personality Development and Psychosexual Development\n20:32 - Chapter 4. Defense Mechanisms, the Aims of Psychoanalysis, Dreams\n29:11 - Chapter 5. Question and Answer on Freud's Theories\n32:55 - Chapter 6. Controversies and Criticisms on Freud's Theories\n42:10 - Chapter 7. Examples of the Unconscious in Modern Psychology\n51:55 - Chapter 8. Further Question and Answer on Freud\n\nComplete course materials are available at the Yale Online website: online.yale.edu\n\nThis course was recorded in Spring 2007.",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/7emS3ye3cVU/default.jpg",
                "width": 120,
                "height": 90
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/7emS3ye3cVU/mqdefault.jpg",
                "width": 320,
                "height": 180
               },
               "high": {
                "url": "https://i.ytimg.com/vi/7emS3ye3cVU/hqdefault.jpg",
                "width": 480,
                "height": 360
               }
              },
              "channelTitle": "YaleCourses",
              "categoryId": "27",
              "liveBroadcastContent": "none",
              "localized": {
               "title": "3. Foundations: Freud",
               "description": "Introduction to Psychology (PSYC 110)\n\nThis lecture introduces students to the theories of Sigmund Freud, including a brief biographical description and his contributions to the field of psychology. The limitations of his theories of psychoanalysis are covered in detail, as well as the ways in which his conception of the unconscious mind still operate in mainstream psychology today.\n\n00:00 - Chapter 1. Sigmund Freud in a Historical Context\n06:51 - Chapter 2. Unconscious Motivation: The Id, Ego and Superego\n13:45 - Chapter 3. Personality Development and Psychosexual Development\n20:32 - Chapter 4. Defense Mechanisms, the Aims of Psychoanalysis, Dreams\n29:11 - Chapter 5. Question and Answer on Freud's Theories\n32:55 - Chapter 6. Controversies and Criticisms on Freud's Theories\n42:10 - Chapter 7. Examples of the Unconscious in Modern Psychology\n51:55 - Chapter 8. Further Question and Answer on Freud\n\nComplete course materials are available at the Yale Online website: online.yale.edu\n\nThis course was recorded in Spring 2007."
              }
             },
             "contentDetails": {
              "duration": "PT56M31S",
              "dimension": "2d",
              "definition": "sd",
              "caption": "true",
              "licensedContent": true
             },
             "status": {
              "uploadStatus": "processed",
              "privacyStatus": "public",
              "license": "youtube",
              "embeddable": true,
              "publicStatsViewable": true
             }
            }
           ]
         },
         yale_relev_any_page2:{
         "kind": "youtube#videoListResponse",
         "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/fZt1X8AwMV9IU4QWzclYfyVBUBQ\"",
         "pageInfo": {
          "totalResults": 1,
          "resultsPerPage": 1
         },
         "items": [
          {
           "kind": "youtube#video",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/sY2D9EU4EdNrRImDeE1HUx16nLE\"",
           "id": "2B9b9mUPJik",
           "snippet": {
            "publishedAt": "2012-04-05T15:30:13.000Z",
            "channelId": "UC4EY_qnSeAP1xGsh61eOoJA",
            "title": "02. The Crisis of the Third Century and the Diocletianic Reforms",
            "description": "The Early Middle Ages, 284--1000 (HIST 210)\n\nProfessor Freedman outlines the problems facing the Roman Empire in the third century.  The Persian Sassanid dynasty in the East and various Germanic tribes in the West threatened the Empire as never before.  Internally, the Empire struggled with the problem of succession, an economy wracked by inflation, and the decline of the local elite which had once held it together.  Having considered these issues, Professor Freedman then moves on to the reforms enacted under Diocletian to stabilize the Empire. He attempted to solve the problem of succession by setting up a system of joint rule called the Tetrarchy, to stabilize the economy through tax reform, and to protect the frontiers through militarization. Although many of his policies failed--some within his lifetime--Diocletian nevertheless saved the Roman Empire from collapse.\n\n00:00 - Chapter 1. Introduction and Logistics\n01:35 - Chapter 2. Third Century Crisis and Barbarian Invasions \n10:10 - Chapter 3. The Problem of Succession\n17:36 - Chapter 4. The Problem of Inflation\n22:48 - Chapter 5. The Ruin of The Local Elite\n26:08 - Chapter 6. Diocletian and his Reforms\n\nComplete course materials are available at the Yale Online website: online.yale.edu\n\n\nThis course was recorded in Fall 2011.",
            "thumbnails": {
             "default": {
              "url": "https://i.ytimg.com/vi/2B9b9mUPJik/default.jpg",
              "width": 120,
              "height": 90
             },
             "medium": {
              "url": "https://i.ytimg.com/vi/2B9b9mUPJik/mqdefault.jpg",
              "width": 320,
              "height": 180
             },
             "high": {
              "url": "https://i.ytimg.com/vi/2B9b9mUPJik/hqdefault.jpg",
              "width": 480,
              "height": 360
             },
             "standard": {
              "url": "https://i.ytimg.com/vi/2B9b9mUPJik/sddefault.jpg",
              "width": 640,
              "height": 480
             },
             "maxres": {
              "url": "https://i.ytimg.com/vi/2B9b9mUPJik/maxresdefault.jpg",
              "width": 1280,
              "height": 720
             }
            },
            "channelTitle": "YaleCourses",
            "categoryId": "27",
            "liveBroadcastContent": "none",
            "localized": {
             "title": "02. The Crisis of the Third Century and the Diocletianic Reforms",
             "description": "The Early Middle Ages, 284--1000 (HIST 210)\n\nProfessor Freedman outlines the problems facing the Roman Empire in the third century.  The Persian Sassanid dynasty in the East and various Germanic tribes in the West threatened the Empire as never before.  Internally, the Empire struggled with the problem of succession, an economy wracked by inflation, and the decline of the local elite which had once held it together.  Having considered these issues, Professor Freedman then moves on to the reforms enacted under Diocletian to stabilize the Empire. He attempted to solve the problem of succession by setting up a system of joint rule called the Tetrarchy, to stabilize the economy through tax reform, and to protect the frontiers through militarization. Although many of his policies failed--some within his lifetime--Diocletian nevertheless saved the Roman Empire from collapse.\n\n00:00 - Chapter 1. Introduction and Logistics\n01:35 - Chapter 2. Third Century Crisis and Barbarian Invasions \n10:10 - Chapter 3. The Problem of Succession\n17:36 - Chapter 4. The Problem of Inflation\n22:48 - Chapter 5. The Ruin of The Local Elite\n26:08 - Chapter 6. Diocletian and his Reforms\n\nComplete course materials are available at the Yale Online website: online.yale.edu\n\n\nThis course was recorded in Fall 2011."
            }
           },
           "contentDetails": {
            "duration": "PT48M37S",
            "dimension": "2d",
            "definition": "hd",
            "caption": "true",
            "licensedContent": false
           },
           "status": {
            "uploadStatus": "processed",
            "privacyStatus": "public",
            "license": "youtube",
            "embeddable": true,
            "publicStatsViewable": true
           }
          }
         ]
        }};

      this.searchResponse = {
         yale_relev_any_page1: {
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/LR0DRkOL9w9YcJoFKGWT1k_kUZQ\"",
           "nextPageToken": "CAEQAA",
           "pageInfo": {
            "totalResults": 1319,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/YBrccviFOokaBBD-_lqlGKTJ0d0\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "7emS3ye3cVU"
             },
             "snippet": {
              "publishedAt": "2008-09-30T19:06:07.000Z",
              "channelId": "UC4EY_qnSeAP1xGsh61eOoJA",
              "title": "3. Foundations: Freud",
              "description": "Introduction to Psychology (PSYC 110) This lecture introduces students to the theories of Sigmund Freud, including a brief biographical description and his ...",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/7emS3ye3cVU/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/7emS3ye3cVU/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/7emS3ye3cVU/hqdefault.jpg"
               }
              },
              "channelTitle": "YaleCourses",
              "liveBroadcastContent": "none"
             }
            }
           ]
          },
         yale_relev_any_page2: {
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/iORVkkanfvfNssM_aplKhUUUccM\"",
           "nextPageToken": "CAIQAA",
           "prevPageToken": "CAEQAQ",
           "pageInfo": {
            "totalResults": 1319,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/hUgNfwmDQI4ncM-mAEcyhDVOhZY\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "2B9b9mUPJik"
             },
             "snippet": {
              "publishedAt": "2012-04-05T15:30:13.000Z",
              "channelId": "UC4EY_qnSeAP1xGsh61eOoJA",
              "title": "02. The Crisis of the Third Century and the Diocletianic Reforms",
              "description": "The Early Middle Ages, 284--1000 (HIST 210) Professor Freedman outlines the problems facing the Roman Empire in the third century. The Persian Sassanid ...",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/2B9b9mUPJik/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/2B9b9mUPJik/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/2B9b9mUPJik/hqdefault.jpg"
               }
              },
              "channelTitle": "YaleCourses",
              "liveBroadcastContent": "none"
             }
            }
           ]
          }
      };

      this.output = {
         yale_relev_any_page1: [{
          channelId: "UC4EY_qnSeAP1xGsh61eOoJA",
          channelTitle: "YaleCourses",
          seconds: 3389,
          duration: "56:31",
          imageUrl: "https://i.ytimg.com/vi/7emS3ye3cVU/mqdefault.jpg",
          publishedAt: moment("2008-09-30T17:56:52.000Z").fromNow(), //"7 years ago",
          title: "3. Foundations: Freud",
          videoId: "7emS3ye3cVU"
        }],
        yale_relev_any_page2: [
        {
          channelId: "UC4EY_qnSeAP1xGsh61eOoJA",
          channelTitle: "YaleCourses",
          duration: "48:37",
          imageUrl: "https://i.ytimg.com/vi/2B9b9mUPJik/mqdefault.jpg",
          publishedAt: "3 years ago",
          title: "02. The Crisis of the Third Century and the Diocletianic Reforms",
          videoId: "2B9b9mUPJik"
        }]
      };

   })

   .controller('mockYTrelated', function(){

      this.searchUrl = {
        shakeRelated_rel_any_page1:'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=&part=snippet&q=&relatedToVideoId=nfWlot6h_JM&type=video&videoDuration=any', 
        shakeRelated_rel_any_page2: 'https://www.googleapis.com/youtube/v3/search?callback=JSON_CALLBACK&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&maxResults=1&order=relevance&pageToken=CAEQAA&part=snippet&q=&relatedToVideoId=nfWlot6h_JM&type=video&videoDuration=any'     
      };

      this.videoUrl = {
        shakeRelated_rel_any_page1: 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=7PCkvCPvDXk,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video',
        shakeRelated_rel_any_page2: 'https://www.googleapis.com/youtube/v3/videos?callback=JSON_CALLBACK&id=e-ORhEE9VVg,&key=AIzaSyDAEHI30eBi2xEPzHZQa1XyXyK2Ie4OpJE&part=snippet,contentDetails,status&type=video'
      };

      this.searchResponse = {
         shakeRelated_rel_any_page1:{
           "kind": "youtube#searchListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/9XuXw-RIgLtZM6Zz8gLhrNOZ6M0\"",
           "nextPageToken": "CAEQAA",
           "pageInfo": {
            "totalResults": 74,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#searchResult",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/jEC2O9yTgEV6fF7vsXJXntfF2vY\"",
             "id": {
              "kind": "youtube#video",
              "videoId": "7PCkvCPvDXk"
             },
             "snippet": {
              "publishedAt": "2014-06-06T01:33:16.000Z",
              "channelId": "UCf3cbfAXgPFL6OywH7JwOzA",
              "title": "Meghan Trainor - All About That Bass",
              "description": "Download “Title” at iTunes:  http://smarturl.it/MTitle\nDownload “Title” at Amazon:  http://smarturl.it/Ttle_MT\nSpotify:  http://smarturl.it/Spf_Title\nGoogle: http://smarturl.it/GPTtle\n\nhttps://www.facebook.com/meghantrainorsongs\nhttps://twitter.com/meghan_trainor\nhttp://instagram.com/meghan_trainor\nhttp://www.meghan-trainor.com/\n\n© 2014 Epic Records, a division of Sony Music Entertainment",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/default.jpg"
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/mqdefault.jpg"
               },
               "high": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/hqdefault.jpg"
               }
              },
              "channelTitle": "MeghanTrainorVEVO",
              "liveBroadcastContent": "none"
             }
            }
           ]
          }, 
         shakeRelated_rel_any_page2:
         {
         "kind": "youtube#searchListResponse",
         "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/PdayFmH8p0ZVuj6pP3RC2lRyR3k\"",
         "nextPageToken": "CAIQAA",
         "prevPageToken": "CAEQAQ",
         "pageInfo": {
          "totalResults": 74,
          "resultsPerPage": 1
         },
         "items": [
          {
           "kind": "youtube#searchResult",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/cXNLnHysDZNnF3NNffzxuLbaPPE\"",
           "id": {
            "kind": "youtube#video",
            "videoId": "e-ORhEE9VVg"
           },
           "snippet": {
            "publishedAt": "2014-11-08T01:43:24.000Z",
            "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
            "title": "Taylor Swift - Blank Space",
            "description": "Watch Taylor's new video for \"Blank Space\".  No animals, trees, automobiles or actors were harmed in the making of this video.  Taylor’s new release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989.",
            "thumbnails": {
             "default": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/default.jpg"
             },
             "medium": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg"
             },
             "high": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg"
             }
            },
            "channelTitle": "TaylorSwiftVEVO",
            "liveBroadcastContent": "none"
           }
          }
         ]
        }
      };
      this.videoResponse = {
         shakeRelated_rel_any_page1 : {
         "kind": "youtube#videoListResponse",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/USHdoz0pQXowBYxhBGtm76dRrTc\"",
           "pageInfo": {
            "totalResults": 1,
            "resultsPerPage": 1
           },
           "items": [
            {
             "kind": "youtube#video",
             "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/Tlz06qCnlaa5d-cNV7sdsXjV5Uo\"",
             "id": "7PCkvCPvDXk",
             "snippet": {
              "publishedAt": "2014-06-11T14:00:07.000Z",
              "channelId": "UCf3cbfAXgPFL6OywH7JwOzA",
              "title": "Meghan Trainor - All About That Bass",
              "description": "Download “Title” at iTunes:  http://smarturl.it/MTitle\nDownload “Title” at Amazon:  http://smarturl.it/Ttle_MT\nSpotify:  http://smarturl.it/Spf_Title\nGoogle: http://smarturl.it/GPTtle\n\nhttps://www.facebook.com/meghantrainorsongs\nhttps://twitter.com/meghan_trainor\nhttp://instagram.com/meghan_trainor\nhttp://www.meghan-trainor.com/\n\n© 2014 Epic Records, a division of Sony Music Entertainment",
              "thumbnails": {
               "default": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/default.jpg",
                "width": 120,
                "height": 90
               },
               "medium": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/mqdefault.jpg",
                "width": 320,
                "height": 180
               },
               "high": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/hqdefault.jpg",
                "width": 480,
                "height": 360
               },
               "standard": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/sddefault.jpg",
                "width": 640,
                "height": 480
               },
               "maxres": {
                "url": "https://i.ytimg.com/vi/7PCkvCPvDXk/maxresdefault.jpg",
                "width": 1280,
                "height": 720
               }
              },
              "channelTitle": "MeghanTrainorVEVO",
              "categoryId": "10",
              "liveBroadcastContent": "none",
              "localized": {
               "title": "Meghan Trainor - All About That Bass",
               "description": "Download “Title” at iTunes:  http://smarturl.it/MTitle\nDownload “Title” at Amazon:  http://smarturl.it/Ttle_MT\nSpotify:  http://smarturl.it/Spf_Title\nGoogle: http://smarturl.it/GPTtle\n\nhttps://www.facebook.com/meghantrainorsongs\nhttps://twitter.com/meghan_trainor\nhttp://instagram.com/meghan_trainor\nhttp://www.meghan-trainor.com/\n\n© 2014 Epic Records, a division of Sony Music Entertainment"
              }
             },
             "contentDetails": {
              "duration": "PT3M10S",
              "dimension": "2d",
              "definition": "hd",
              "caption": "false",
              "licensedContent": true,
              "regionRestriction": {
               "allowed": [
                "BM",
                "BL",
                "BO",
                "BN",
                "BI",
                "JP",
                "BJ",
                "BE",
                "BD",
                "BG",
                "BF",
                "BA",
                "BB",
                "JE",
                "BY",
                "BZ",
                "JM",
                "BT",
                "JO",
                "BV",
                "YE",
                "BS",
                "BH",
                "LV",
                "RU",
                "CV",
                "RW",
                "RS",
                "RO",
                "RE",
                "CU",
                "KR",
                "CK",
                "KP",
                "UG",
                "ZA",
                "CO",
                "CL",
                "CM",
                "ZM",
                "YT",
                "KY",
                "CF",
                "CG",
                "CD",
                "CZ",
                "ZW",
                "CY",
                "KG",
                "KE",
                "CR",
                "KH",
                "KI",
                "KN",
                "KM",
                "SZ",
                "SY",
                "SR",
                "SV",
                "ST",
                "SJ",
                "SK",
                "SH",
                "SI",
                "SN",
                "SO",
                "SL",
                "SM",
                "SB",
                "SC",
                "SA",
                "SG",
                "SD",
                "SE",
                "FO",
                "BW",
                "HK",
                "PR",
                "PW",
                "HN",
                "HM",
                "PT",
                "PY",
                "ET",
                "PA",
                "PG",
                "PF",
                "PE",
                "PK",
                "HR",
                "PH",
                "PN",
                "PM",
                "PL",
                "CA",
                "AD",
                "AE",
                "AF",
                "AG",
                "AI",
                "AL",
                "AM",
                "AO",
                "AQ",
                "AR",
                "AS",
                "AT",
                "AU",
                "AW",
                "AX",
                "AZ",
                "IL",
                "IM",
                "IN",
                "IO",
                "PS",
                "ID",
                "IE",
                "QA",
                "IQ",
                "IR",
                "IS",
                "IT",
                "TZ",
                "UM",
                "FR",
                "UA",
                "FI",
                "FK",
                "FJ",
                "FM",
                "UY",
                "UZ",
                "EE",
                "US",
                "NA",
                "NC",
                "TT",
                "NE",
                "NG",
                "NF",
                "NI",
                "NL",
                "NO",
                "NP",
                "NR",
                "NU",
                "NZ",
                "VI",
                "GG",
                "GD",
                "GE",
                "GB",
                "VN",
                "GN",
                "VC",
                "GM",
                "VE",
                "VG",
                "GI",
                "GW",
                "GT",
                "GU",
                "GR",
                "GS",
                "GP",
                "GQ",
                "VU",
                "GY",
                "OM",
                "WS",
                "WF",
                "GF",
                "DZ",
                "BR",
                "CH",
                "DO",
                "DM",
                "CI",
                "DK",
                "DJ",
                "CN",
                "KW",
                "VA",
                "LC",
                "LB",
                "LA",
                "GA",
                "LK",
                "LI",
                "KZ",
                "LU",
                "LT",
                "LS",
                "LR",
                "CC",
                "GL",
                "LY",
                "HU",
                "TO",
                "TN",
                "TM",
                "TL",
                "TK",
                "TJ",
                "TH",
                "TG",
                "TF",
                "TD",
                "TC",
                "HT",
                "ER",
                "ES",
                "EH",
                "GH",
                "TW",
                "TV",
                "EG",
                "TR",
                "EC",
                "MD",
                "ME",
                "MF",
                "MG",
                "MA",
                "MC",
                "ML",
                "MM",
                "MN",
                "MO",
                "MH",
                "CX",
                "MK",
                "MT",
                "MU",
                "MV",
                "MW",
                "MP",
                "MQ",
                "MR",
                "MS",
                "MX",
                "MY",
                "MZ"
               ]
              }
             },
             "status": {
              "uploadStatus": "processed",
              "privacyStatus": "public",
              "license": "youtube",
              "embeddable": true,
              "publicStatsViewable": true
             }
            }
           ]
          }, 
         shakeRelated_rel_any_page2:
         {
         "kind": "youtube#videoListResponse",
         "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/pvT_B_UjFk99okcy6XhnOA2QZ6k\"",
         "pageInfo": {
          "totalResults": 1,
          "resultsPerPage": 1
         },
         "items": [
          {
           "kind": "youtube#video",
           "etag": "\"tbWC5XrSXxe1WOAx6MK9z4hHSU8/-eRVMYlE_VXIlu1wTs6JvJP00hI\"",
           "id": "e-ORhEE9VVg",
           "snippet": {
            "publishedAt": "2014-11-10T17:05:44.000Z",
            "channelId": "UCANLZYMidaCbLQFWXBC95Jg",
            "title": "Taylor Swift - Blank Space",
            "description": "Watch Taylor's new video for \"Blank Space\".  No animals, trees, automobiles or actors were harmed in the making of this video.  Taylor’s new release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989.",
            "thumbnails": {
             "default": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/default.jpg",
              "width": 120,
              "height": 90
             },
             "medium": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg",
              "width": 320,
              "height": 180
             },
             "high": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/hqdefault.jpg",
              "width": 480,
              "height": 360
             },
             "standard": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/sddefault.jpg",
              "width": 640,
              "height": 480
             },
             "maxres": {
              "url": "https://i.ytimg.com/vi/e-ORhEE9VVg/maxresdefault.jpg",
              "width": 1280,
              "height": 720
             }
            },
            "channelTitle": "TaylorSwiftVEVO",
            "categoryId": "10",
            "liveBroadcastContent": "none",
            "localized": {
             "title": "Taylor Swift - Blank Space",
             "description": "Watch Taylor's new video for \"Blank Space\".  No animals, trees, automobiles or actors were harmed in the making of this video.  Taylor’s new release 1989 is Available Now on iTunes http://www.smarturl.it/TS1989."
            }
           },
           "contentDetails": {
            "duration": "PT4M33S",
            "dimension": "2d",
            "definition": "hd",
            "caption": "false",
            "licensedContent": true
           },
           "status": {
            "uploadStatus": "processed",
            "privacyStatus": "public",
            "license": "youtube",
            "embeddable": true,
            "publicStatsViewable": true
           }
          }
         ]
        }
      };
      this.output = {
         shakeRelated_rel_any_page1:{
            channelId: "UCf3cbfAXgPFL6OywH7JwOzA",
            channelTitle: "MeghanTrainorVEVO",
            duration: "3:10",
            seconds: 188,
            imageUrl: "https://i.ytimg.com/vi/7PCkvCPvDXk/mqdefault.jpg",
            publishedAt: moment("2014-06-06T01:33:16.000Z").fromNow(),//"a year ago",
            title: "Meghan Trainor - All About That Bass",
            videoId: "7PCkvCPvDXk"
         }, 
         shakeRelated_rel_any_page2: {
            channelId: "UCANLZYMidaCbLQFWXBC95Jg",
            channelTitle: "TaylorSwiftVEVO",
            duration: "4:33",
            imageUrl: "https://i.ytimg.com/vi/e-ORhEE9VVg/mqdefault.jpg",
            publishedAt: "6 months ago",
            title: "Taylor Swift - Blank Space",
            videoId: "e-ORhEE9VVg"
         }
      };
      
   });