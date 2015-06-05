var express = require('express');
var router = express.Router();

/* GET TEST PAGE. */
router.get('/', function(req, res, next) {
  res.render('test', { title: 'Iframe Tests' });
});

module.exports = router;