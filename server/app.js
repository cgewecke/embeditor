// Local DB shell launch
// mongod --dbpath data/db/ --logpath data/logs/mongodb.log --logappend

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var handlebars = require('express3-handlebars');

// Routes
var index = require('./routes/index');
var embed = require('./routes/embed');
var videos = require('./routes/videos');
var api = require('./routes/api');

// Git-Phaser Routes
var help = require('./routes/help');
var gitphaser = require('./routes/gitphaser'); 

// APP
var app = express();

// TEMPLATE ENGINE
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

/**
 *  CORS for GitPhaser landing page.
 */
var allowCrossDomainProduction = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://gitphaser.com');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

var allowCrossDomainDevelopment = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

/**
 * forceSsl: Redirect from http to https. 
 */
var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
};


/**
 * Development Settings
 */

if (app.get('env') === 'development') {

    // Allow localhost to make GET requests
    app.use(allowCrossDomainDevelopment);

    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));

    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));
    app.use(express.static(path.join(__dirname, '/public')));

    // Error Handling
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

/**
 * Production Settings
 */
if (app.get('env') === 'production') {

    // Force SSL on Heroku
    app.use(forceSsl);
    
    // Allow gitphaser.com to make GET requests
    app.use(allowCrossDomainProduction);

    // Use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));
    app.use(express.static(path.join(__dirname, '/public')));

    // Production error handler
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
}

app.use('/embed', embed);
app.use('/videos', videos);
app.use('/api', api);
app.use('/help', help);
app.use('/gitphaser', gitphaser);

module.exports = app; 
