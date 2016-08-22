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
var users = require('./routes/users');
var signup = require('./routes/signup');
var embed = require('./routes/embed');
var videos = require('./routes/videos');
var api = require('./routes/api');
var test = require('./routes/test');
var help = require('./routes/help');

// APP
var app = express();

// TEMPLATE ENGINE
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


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

app.use('/signup', signup);
app.use('/embed', embed);
app.use('/videos', videos);
app.use('/api', api);
app.use('/test', test);
app.use('/help', help);


module.exports = app; 
