(function() {
  'use strict';

  var KarmaTestTool = require('karma-test-tool');

  describe('EventTrackingDirectiveTest', function() {
    var testComponents, $compile, $state, AnalyticsTrackingService, AnalyticsDataLayerService;

    beforeEach(function() {
      testComponents = new KarmaTestTool()
        .module('at.ng.analytics', [])
        .service(['$compile', '$state', 'AnalyticsTrackingService', 'AnalyticsDataLayerService'])
        .withScope()
        .build();

      $compile = testComponents.service('$compile');
      $state = testComponents.service('$state');
      AnalyticsTrackingService = testComponents.service('AnalyticsTrackingService');
      AnalyticsDataLayerService = testComponents.service('AnalyticsDataLayerService');
    });

    describe('Event tracking', function() {
      it('should track event with the label from element', function() {
        // given
        var element = angular.element('<button at-ng-event-tracking="labelValue"></button>');
        $state.current.name = 'a';
        spyOn(AnalyticsTrackingService, 'trackEvent');

        // when
        var compiled = $compile(element)(testComponents.$scope);
        testComponents.$scope.$apply();
        compiled.triggerHandler('click');

        // then
        expect(AnalyticsTrackingService.trackEvent).toHaveBeenCalledWith('a', 'labelValue');
      });

      it('should set custom dimensions provided in attribute', function() {
        // given
        testComponents.$scope.dimensionValueInScope = 'dimensionValue';
        var element = angular.element('<button at-ng-event-tracking="labelValue" at-ng-event-tracking-data="{\'dimensionVar\':dimensionValueInScope}"></button>');
        $state.current.name = 'a';
        spyOn(AnalyticsDataLayerService, 'setVar');
        spyOn(AnalyticsTrackingService, 'trackEvent');

        // when
        var compiled = $compile(element)(testComponents.$scope);
        testComponents.$scope.$apply();
        compiled.triggerHandler('click');

        // then
        expect(AnalyticsDataLayerService.setVar).toHaveBeenCalledWith('dimensionVar', 'dimensionValue');
        expect(AnalyticsTrackingService.trackEvent).toHaveBeenCalledWith('a', 'labelValue');
      });
    });
  });
}());
