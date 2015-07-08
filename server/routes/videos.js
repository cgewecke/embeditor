var express = require('express');
var router = express.Router();
var db = require('../database');
var Videos = db.videos;

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  
   var params = req.params

   Videos.findOne({
      '_id': params.id

   }, function(err, video){  
      (err || !video) ? 
         responder(res, err, video, params): //Error
         responder(res, err, video, params); //Success
      }
   );
});

function responder(res, err, video, params){

   var encodedUrl, shareUrls;

   // Log error
   if (err) {
     console.log('Error for /video: ' + params.id + ". Error was: " +  err);
     res.status(404).render('404');
   
   // Log success + dynamically generate iframe code at embed.hbs
   } else {
      console.log('Served /video: ' + video._id);

      // Urls for og: & twitter meta tags
      video.cyclopseUrl = 'http://www.cyclop.se/videos/' + video._id;
      video.youtubeUrl = 'https://www.youtube.com/watch?v=' + video.videoId;
      
      // Share Urls for share buttons 
      encodedUrl = encodeURIComponent(video.cyclopseUrl);
      shareUrls = {
         facebook: '//www.facebook.com/sharer/sharer.php?u=' + encodedUrl,
         twitter: '//www.twitter.com/intent/tweet?url=' + encodedUrl,
         tumblr: '//www.tumblr.com/share/link?url=' + encodedUrl.replace('http://', '').replace('https://')
      };

      res.status(201);
      res.render('embed', {video: video, cyclopse: true, share: shareUrls }); 
   }
};

module.exports = router;