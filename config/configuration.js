(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');

  /* @ngInject */
  function DisableDefaultPageTracking($analyticsProvider) {
    $analyticsProvider.virtualPageviews(false);
  }

  /* @ngInject */
  function StateEvents($rootScope, $timeout, $state) {
    $rootScope.$on('$stateChangeSuccess', function() {
      $timeout(function() {
        console.log($state.$current.locals.resolve.$$values);
      });
    });
  }

  /* @ngInject */
  function AnalyticsProperties() {
    var factory = {
      validateConfiguration: true
    };
    return factory;
  }

  analyticsModule.config(DisableDefaultPageTracking);
  analyticsModule.run(StateEvents);
  analyticsModule.factory('AnalyticsProperties', AnalyticsProperties);
}());
