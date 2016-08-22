var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { 
  console.log('hitting app.js');
  res.send('app.html');
});

module.exports = router;