(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');

  /* @ngInject */
  function AnalyticsTrackingService($analytics, AnalyticsConfigService, AnalyticsDataLayerService) {
    var service = {
      trackPageView: trackPageView,
      trackEvent: trackEvent
    };
    return service;

    function trackPageView(stateName) {
      var pagesConfig = AnalyticsConfigService.getPages();

      var page = findPage(pagesConfig, stateName);

      var customDimensions = buildCustomDimensions(page, page.customDimensions);
      $analytics.setUserProperties(customDimensions);
      $analytics.pageTrack(window.location.hash);
    }

    function trackEvent(stateName, eventLabel) {
      var eventVariables = {};

      var page = findPage(AnalyticsConfigService.getPages(), stateName);
      var pageCustomDimensions = buildCustomDimensions(page, page.customDimensions);
      angular.extend(eventVariables, pageCustomDimensions);

      var event = findEvent(page.events, eventLabel) || findEvent(AnalyticsConfigService.getEvents(), eventLabel);
      if (event.customDimensions) {
        var eventCustomDimensions = buildCustomDimensions(page, event.customDimensions);
        angular.extend(eventVariables, eventCustomDimensions);
      }

      eventVariables.category = event.category;
      eventVariables.action = 'click';
      eventVariables.label = event.labelDataLayerVar
        ? AnalyticsDataLayerService.getVar(event.labelDataLayerVar)
        : eventLabel;

      $analytics.eventTrack(eventVariables.action, eventVariables);
    }

    function buildCustomDimensions(page, customDimensionNames) {
      var customDimensionsConfig = AnalyticsConfigService.getCustomDimensions();
      var customDimensions = {};
      customDimensionNames.forEach(function(name) {
        var dimension = findDimension(customDimensionsConfig, name);
        var dimensionValue = dimension.value || AnalyticsDataLayerService.getVar(dimension.dataLayerVar) || (page.defaultDataLayerValues ? page.defaultDataLayerValues[dimension.dataLayerVar] : undefined);
        if (dimensionValue) {
          customDimensions[('dimension' + dimension.id)] = dimensionValue.toString();
        }
      });
      return customDimensions;
    }
  }

  function findPage(pages, state) {
    return findConfigItem(pages, 'state', state);
  }

  function findDimension(dimensions, name) {
    return findConfigItem(dimensions, 'name', name);
  }

  function findEvent(events, eventLabel) {
    return findConfigItem(events, 'label', eventLabel);
  }

  function findConfigItem(array, idName, idValue) {
    if (!array) {
      return;
    }
    for (var i = 0; i < array.length; i++) {
      if (array[i][idName] === idValue) {
        return array[i];
      }
    }
  }

  analyticsModule.service('AnalyticsTrackingService', AnalyticsTrackingService);
  module.exports = AnalyticsTrackingService;
}());
