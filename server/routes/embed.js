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
      responder(res, err, video, params);
   });
});

function responder(res, err, video, params){
   // Log error
   if (err || !video) {
     console.log('Embed error for video: ' + params.id + ". Error was: " +  err);
     res.status(404).render('404');
   
   // Log success + dynamically generate iframe code at embed.hbs
   } else {
      console.log('Served embed: ' + video._id + "  " + video.title );
      
      video.cyclopseUrl = 'https://www.cyclop.se/embed/' + video._id;
      video.twitterUrl = 'https://www.cyclop.se/embed/' + video._id;
      
      res.status(200);
      res.render('embed', {video: video, iframe: true }); 
   }
};

module.exports = router;