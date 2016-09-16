var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var pw = process.env.pw;
var transporter = nodemailer.createTransport('smtps://penelope%40cyclop.se:' + pw + '@smtp.gmail.com');

// This is a route for the git-phaser landing page that sends an email to penelope
// asking for an invitation to test git-phaser on TestFlight
router.get('/:email', function(req, res, next) {
	
	var params = req.params;
	
	// Setup email
	var mailOptions = {
		from: 'penelope@cyclop.se', 
		to: 'penelope@cyclop.se', 
		subject: 'git-phaser invitation request', 
		text: params.email 
	};

	// Send mail
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			console.log('Send mail failed: ' + error)
			res.status(400).send(error);
			return;
		}
		res.status(201).send('Message was sent.');
		console.log('Message sent: ' + info.response);
		return;
	});
});

module.exports = router;