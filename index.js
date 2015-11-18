(function() {
  'use strict';

  require('angulartics');
  require('angulartics/dist/angulartics-debug.min');
  require('angulartics-google-analytics');
  require('./config/');
  require('./directives/');
  require('./services/');
  require('./analytics.module');
}());
