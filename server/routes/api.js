/**
 * This handles creation and retrieval of 'video' assets 
 * from the database
 */
var express = require('express');
var router = express.Router();
var db = require('../database');
var Videos = db.videos;

// GET /videos (create video)
router.get('/videos/:id', function(req, res){

   var body = req.body;
   var params = req.params
   var opType = "get";

   Videos.findById( params.id, function(err, video){
      (err || !video) ? 
         responder(res, err, body, opType) : // Error
         responder(res, err, video, opType); // Success
   });
});

// POST /videos (create video)
router.post('/videos', function (req, res) {

   var body = req.body;
   var params = req.params
   var opType = "create";

   var newVideo = new Videos({
      videoId: body.videoId,
      quality: body.quality,
      autoplay: body.autoplay,
      loop: body.loop,
      mute: body.mute,
      rate: body.rate,
      start: body.start,
      end: body.end,
      width: body.width,
      height: body.height,
      title: body.title,
      imageUrl: body.imageUrl
   });

   newVideo.save(function(err, savedVideo){
      (err) ? 
         responder(res, err, body, opType) :      // Error
         responder(res, err, savedVideo, opType); // Success
   });
});


// POST /videos/:id route (update video)
router.post('/videos/:id', function (req, res) {

   var body = req.body;
   var params = req.params
   var opType = "update";

   console.log('params.id + ' + params.id);
   Videos.findById(params.id, function(err, video){

      if (err) responder(res, err, body, opType)
      else {
         video.width = body.width;
         video.height = body.height;
         
         video.save(function (err, savedVideo) { 
         
            (err) ? 
               responder(res, err, body, opType):       //Error
               responder(res, err, savedVideo, opType); //Success
         });
      }
   });
});


function responder(res, err, video, opType){

   // Log error
   if (err || !video) {
     console.log('Problem with ' + opType + ' video due to ' + err);
     res.status(500).json({'message': 'Database error ' + opType + ' video: ' + video.videoId });
   
   // Log success + return document w/id
   } else {
      console.log(opType +  'video: ' + video._id + "  " + video.title);
      res.status(201).json({
        'message': 'Success: '+ opType + ' video',
        'video': video
      });  
   }
}

// export the router for usage in our server/router/index.js
module.exports = router;