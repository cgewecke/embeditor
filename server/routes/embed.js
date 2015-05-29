var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:video', function(req, res, next) {
   console.log('in embed route');
  var response = req.params.video
  res.render('embed', {video: response});
});

module.exports = router;