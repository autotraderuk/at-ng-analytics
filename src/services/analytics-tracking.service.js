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

      var customDimensions = getCustomDimensionsFromIds(page.customDimensions);
      $analytics.setUserProperties(customDimensions);
      $analytics.pageTrack(window.location.hash);
    }

    function trackEvent(stateName, eventLabel) {
      var eventVariables = {};

      var page = findPage(AnalyticsConfigService.getPages(), stateName);
      var pageCustomDimensions = getCustomDimensionsFromIds(page.customDimensions);
      angular.extend(eventVariables, pageCustomDimensions);

      var event = findEvent(page.events, eventLabel) || findEvent(AnalyticsConfigService.getEvents(), eventLabel);
      if (event.customDimensions) {
        var eventCustomDimensions = getCustomDimensionsFromIds(event.customDimensions);
        angular.extend(eventVariables, eventCustomDimensions);
      }

      eventVariables.category = event.category;
      eventVariables.action = 'click';
      eventVariables.label = event.labelDataLayerVar
        ? AnalyticsDataLayerService.getVar(event.labelDataLayerVar)
        : eventLabel;

      $analytics.eventTrack(eventVariables.action, eventVariables);
    }

    function getCustomDimensionsFromIds(customDimensionIds) {
      var customDimensionsConfig = AnalyticsConfigService.getCustomDimensions();
      var customDimensions = {};
      customDimensionIds.forEach(function(id) {
        var dimension = findDimension(customDimensionsConfig, id);
        customDimensions[('dimension' + id)] = dimension.value || AnalyticsDataLayerService.getVar(dimension.dataLayerVar);
      });
      return customDimensions;
    }
  }

  function findPage(pages, state) {
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].state === state) {
        return pages[i];
      }
    }
  }

  function findDimension(dimensions, id) {
    for (var i = 0; i < dimensions.length; i++) {
      if (dimensions[i].id === id) {
        return dimensions[i];
      }
    }
  }

  function findEvent(events, eventLabel) {
    for (var i = 0; i < events.length; i++) {
      if (events[i].label === eventLabel) {
        return events[i];
      }
    }
  }

  analyticsModule.service('AnalyticsTrackingService', AnalyticsTrackingService);
  module.exports = AnalyticsTrackingService;
}());
