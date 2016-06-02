(function() {
  'use strict';

  DisableDefaultPageTracking.$inject = ["$analyticsProvider"];
  StateEvents.$inject = ["$rootScope", "$timeout", "$state", "AnalyticsTrackingService"];
  var analyticsModule = require('../analytics.module');

  function DisableDefaultPageTracking($analyticsProvider) {
    $analyticsProvider.virtualPageviews(false);
  }

  function StateEvents($rootScope, $timeout, $state, AnalyticsTrackingService) {
    $rootScope.$on('$stateChangeSuccess', function() {
      $timeout(function() {
        AnalyticsTrackingService.trackPageView($state.current.name);
      });
    });
  }

  analyticsModule.config(DisableDefaultPageTracking);
  analyticsModule.run(StateEvents);
}());
