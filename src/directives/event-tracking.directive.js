(function() {
  'use strict';
  var analyticsModule = require('../analytics.module');

  /* @ngInject */
  function EventTrackingDirective($state, AnalyticsTrackingService, AnalyticsDataLayerService) {
    return {
      scope: {
        eventTrackingData: '=atNgEventTrackingData'
      },
      link: function(scope, element, attrs) {
        var stateName = $state.current.name;
        element.bind('click', function() {
          var extraData = scope.eventTrackingData;
          if (extraData) {
            for (var property in extraData) {
              if (extraData.hasOwnProperty(property)) {
                AnalyticsDataLayerService.setVar(property, extraData[property]);
              }
            }
          }
          AnalyticsTrackingService.trackEvent(stateName, attrs.atNgEventTracking);
        });
      },
      restrict: 'A'
    };
  }
  analyticsModule.directive('atNgEventTracking', EventTrackingDirective);
  module.exports = EventTrackingDirective;
}());
