// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-04-23 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  var configuration = {
  
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [

      
      
      // bower:js
                  'bower_components/jquery/dist/jquery.js',
                  'bower_components/angular/angular.js',
                  'bower_components/angular-animate/angular-animate.js',
                  'bower_components/angular-cookies/angular-cookies.js',
                  'bower_components/angular-resource/angular-resource.js',
                  'bower_components/angular-route/angular-route.js',
                  'bower_components/angular-sanitize/angular-sanitize.js',
                  'bower_components/angular-touch/angular-touch.js',
                  'bower_components/angular-aria/angular-aria.js',
                  'bower_components/angular-material/angular-material.js',
                  'bower_components/angular-material-icons/angular-material-icons.min.js',
                  'bower_components/angular-messages/angular-messages.js',
                  'bower_components/angular-mocks/angular-mocks.js',
                  // endbower

      // Vendor dependencies
      'app/scripts/vendor/ion.rangeSlider.min.js',
      'app/scripts/vendor/moment.min.js',
      'app/scripts/vendor/momentz-duration.js',
      'app/scripts/vendor/ZeroClipboard.min.js',

      // Cyclopse code
      "app/fonts/*.js",
      "app/scripts/**/*.js",
      'app/templates/*.html',
      "test/mock/**/*.js",
      "test/unit/**/*.js"
      //"test/unit/services/youtubedataAPI.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    browsers: [
      'Chrome'
    ],

    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      },
      
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Which plugins to enable
    plugins: [
      "karma-chrome-launcher",
      "karma-jasmine",
      "karma-mocha-reporter",
      "karma-ng-html2js-preprocessor"
    ],

    preprocessors: {
      'app/templates/*.html': ['ng-html2js']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates',
      stripPrefix: 'app/'
    },

    reporters: ['mocha'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

  };

  if (process.env.TRAVIS) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
};
