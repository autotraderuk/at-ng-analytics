(function() {
  'use strict';
  var analyticsModule = require('../analytics.module');

  /* @ngInject */
  function EventTrackingDirective($state, AnalyticsTrackingService, AnalyticsDataLayerService) {
    return {
      priority: 100,
      scope: {
        eventTrackingData: '=atNgEventTrackingData'
      },
      link: {
        pre: function (scope, element, attrs) {
          var stateName = $state.current.name;
          element.bind('click', function (event) {
            if (!event.target.trackingHandled) {
              event.target.trackingHandled = true;
              var extraData = scope.eventTrackingData;
              if (extraData) {
                for (var property in extraData) {
                  if (extraData.hasOwnProperty(property)) {
                    AnalyticsDataLayerService.setVar(property, extraData[property]);
                  }
                }
              }
              AnalyticsTrackingService.trackEvent(stateName, attrs.atNgEventTracking);
            }
          });
        }
      },
      restrict: 'A'
    };
  }
  analyticsModule.directive('atNgEventTracking', EventTrackingDirective);
  module.exports = EventTrackingDirective;
}());