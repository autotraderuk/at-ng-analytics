(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');
  var configValidationTools = require('./config-validation-tools');

  /* @ngInject */
  function AnalyticsConfigService(AnalyticsProperties) {
    var customDimensions = [];
    var events = [];
    var pages = [];

    var service = {
      registerCustomDimensions: registerCustomDimensions,
      registerEvents: registerEvents,
      registerPages: registerPages,
      getCustomDimensions: function() {return customDimensions;},
      getEvents: function() {return events;},
      getPages: function() {return pages;}
    };
    return service;

    function registerCustomDimensions(config) {
      if (AnalyticsProperties.validateConfiguration) {
        configValidationTools.validateCustomDimensions(config);
      }
      customDimensions = config;
    }

    function registerEvents(config) {
      if (AnalyticsProperties.validateConfiguration) {
        configValidationTools.validateEvents(config);
      }
      events = config;
    }

    function registerPages(config) {
      if (AnalyticsProperties.validateConfiguration) {
        configValidationTools.validatePages(config);
      }
      pages = config;
    }
  }

  analyticsModule.service('AnalyticsConfigService', AnalyticsConfigService);
  module.exports = AnalyticsConfigService;
}());
