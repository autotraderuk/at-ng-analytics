(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');

  function AnalyticsProperties() {
    var factory = {
      validateConfiguration: true,
      includeIndexIdentifiedCustomDimensions: false
    };
    return factory;
  }

  analyticsModule.factory('AnalyticsProperties', AnalyticsProperties);
}());
