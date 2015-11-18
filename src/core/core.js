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

  /* @ngInject */
  function AnalyticsProperties() {
    var factory = {
      validateConfiguration: true,
      useStateAsPrimaryDataLayer: false
    };
    return factory;
  }

  analyticsModule.config(DisableDefaultPageTracking);
  analyticsModule.run(StateEvents);
  analyticsModule.factory('AnalyticsProperties', AnalyticsProperties);
}());
