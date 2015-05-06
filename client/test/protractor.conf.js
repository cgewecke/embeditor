exports.config = {

  //chromeDriver: '../node_modules/grunt-protractor-runner/selenium/chromedriver',

  specs: ['e2e/*.js'],

  capabilities: {
    'browserName': 'firefox'
  },
  

  // url where your app is running, relative URLs are prepending with this URL
  baseUrl: 'http://localhost:9000/',

  // testing framework, jasmine is the default
  framework: 'jasmine'
};