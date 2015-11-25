(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');

  /* @ngInject */
  function DisableDefaultPageTracking($analyticsProvider) {
    $analyticsProvider.virtualPageviews(false);
  }

  /* @ngInject */
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
