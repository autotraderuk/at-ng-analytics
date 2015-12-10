(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');

  /* @ngInject */
  function AnalyticsProperties() {
    var factory = {
      validateConfiguration: true
    };
    return factory;
  }

  analyticsModule.factory('AnalyticsProperties', AnalyticsProperties);
}());
