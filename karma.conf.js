module.exports = function (config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // where to resolve files from - currently the project base directory
    basePath: '.',

    colors: false,

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['browserify', 'jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // core dependencies
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angulartics/src/angulartics.js',
      'node_modules/angulartics-google-analytics/lib/angulartics-google-analytics.js',

      // Our functions
      'src/core/core.js',
      'src/core/analytics-properties.js',
      'src/services/analytics-data-layer.service.js',
      'src/services/analytics-config.service.js',
      'src/services/analytics-tracking.service.js',
      'src/directives/event-tracking.directive.js',

      // tests
      'src/services/analytics-data-layer.service.spec.js',
      'src/services/analytics-tracking.service.spec.js',
      'src/services/analytics-config.service.spec.js',
      'src/directives/event-tracking.directive.spec.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8081,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-browserify'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['browserify']
    }
  });
};