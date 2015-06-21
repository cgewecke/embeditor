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
      (err) ? 
         responder(res, err, video, params): //Error
         responder(res, err, video, params); //Success
      }
   );
});

function responder(res, err, video, params){
   // Log error
   if (err) {
     console.log('Error for /video: ' + params.id + ". Error was: " +  err);
     res.status(404).render('404');
   
   // Log success + dynamically generate iframe code at embed.hbs
   } else {
      console.log('Served /video: ' + video._id);
      video.cyclopseUrl = 'http://www.cyclop.se/videos/' + video._id;
      console.log('cyclops url: ' + video.cyclopseUrl);
      res.status(201);
      res.render('embed', {video: video, cyclopse: true }); 
   }
};

module.exports = router;