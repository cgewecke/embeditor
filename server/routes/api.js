/**
 * This handles the signing up of users
 */
var express = require('express');
var router = express.Router();
var db = require('../database');
var Videos = db.videos;

// POST /videos (create video)
router.get('/videos/:id', function(req, res){

   var body = req.body;
   var params = req.params
   var opType = "get";

   Videos.findOne({
      '_id': params.id

   }, function(err, video){
      (err) ? 
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
      height: body.height
   });

   newVideo.save( function(err, savedVideo){
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

   Videos.findOne({
      '_id': params.id

   }, function(err, video){

      if (err) responder(res, err, body, opType)
      else {
         video.update(
            { videoId: body.videoId },
            { quality: body.quality },
            { autoplay: body.autoplay },
            { loop: body.loop },
            { mute: body.mute },
            { rate: body.rate },
            { start: body.start },
            { end: body.end },
            { width: body.width },
            { height: body.height },
         
         function (err, savedVideo) { 
            (err) ? 
               responder(res, err, body, opType):       //Error
               responder(res, err, savedVideo, opType); //Success
         });
      }
   });
});


function responder(res, err, video, opType){

   // Log error
   if (err) {
     console.log('Problem with' + opType + ' video due to ' + err);
     res.status(500).json({'message': 'Database error ' + opType + ' video: ' + savedVideo.videoId });
   
   // Log success + return document w/id
   } else {
      
      console.log('Success: ' + opType + ' new video: ' + savedVideo._id);
      res.status(201).json({
        'message': 'Success: '+ opType + ' new user',
        'client': savedVideo
      });  
   }
}

// export the router for usage in our server/router/index.js
module.exports = router;