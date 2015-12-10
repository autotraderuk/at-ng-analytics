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
          throw new Error(JSON.stringify(customDimensionsValidator.errors));
        }
        checkUniqueness(config, 'name', 'Custom Dimension names are not unique');
      }
      customDimensions = config;
    }

    function registerEvents(config) {
      if (AnalyticsProperties.validateConfiguration) {
        var eventsValidator = validator(require('../schemas/events.schema'));
        if (!eventsValidator(config)) {
          throw new Error(JSON.stringify(eventsValidator.errors));
        }
        checkUniqueness(config, 'label', 'Event labels are not unique');
      }
      events = config;
    }

    function registerPages(config) {
      if (AnalyticsProperties.validateConfiguration) {
        var pagesValidator = validator(require('../schemas/pages.schema'));
        if (!pagesValidator(config)) {
          throw new Error(JSON.stringify(pagesValidator.errors));
        }
        checkUniqueness(config, 'state', 'Page states are not unique');
        for (var i = 0; i < config.length; i++) {
          if (config[i].events) {
            checkUniqueness(config[i].events, 'label', 'Event labels are not unique');
          }
        }
      }
      pages = config;
    }

    function checkUniqueness(objectArray, property, message) {
      var collector = [];
      for (var i = 0; i < objectArray.length; i++) {
        var value = objectArray[i][property];
        if (collector.indexOf(value) > -1) {
          throw new Error(message);
        }
        collector.push(value);
      }
    }
  }

  analyticsModule.service('AnalyticsConfigService', AnalyticsConfigService);
  module.exports = AnalyticsConfigService;
}());
