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
var routes = require('./routes/index');
var users = require('./routes/users');
var signup = require('./routes/signup');
var embed = require('./routes/embed');
var api = require('./routes/api');
var test = require('./routes/test');

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
 * Development Settings
 */

if (app.get('env') === 'development') {

    // This will change in production since we'll be using the dist folder
    app.use(express.static(path.join(__dirname, '../client')));
    // This covers serving up the index page
    app.use(express.static(path.join(__dirname, '../client/.tmp')));
    app.use(express.static(path.join(__dirname, '../client/app')));

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

    // changes it to use the optimized version for production
    app.use(express.static(path.join(__dirname, '/dist')));

    // production error handler
    // no stacktraces leaked to user
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
app.use('/api', api);
app.use('/test', test);
module.exports = app; 
