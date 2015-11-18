(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');
  var validator = require('is-my-json-valid');

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
        var customDimensionsValidator = validator(require('../schemas/custom-dimensions.schema'));
        if (!customDimensionsValidator(config)) {
          throw new Error(customDimensionsValidator.errors);
        }
      }
      customDimensions = config;
    }

    function registerEvents(config) {
      if (AnalyticsProperties.validateConfiguration) {
        var eventsValidator = validator(require('../schemas/events.schema'));
        if (!eventsValidator(config)) {
          throw new Error(eventsValidator.errors);
        }
      }
      events = config;
    }

    function registerPages(config) {
      if (AnalyticsProperties.validateConfiguration) {
        var pagesValidator = validator(require('../schemas/pages.schema'));
        if (!pagesValidator(config)) {
          throw new Error(pagesValidator.errors);
        }
      }
      pages = config;
    }
  }

  analyticsModule.service('AnalyticsConfigService', AnalyticsConfigService);
  module.exports = AnalyticsConfigService;
}());
