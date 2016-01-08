(function() {
  'use strict';

  describe('EventTrackingDirectiveTest', function() {
    var $compile, $state, AnalyticsTrackingService, AnalyticsDataLayerService, $scope;

    beforeEach(function() {
      angular.mock.module('at.ng.analytics');
    });

    beforeEach(inject(function (_AnalyticsTrackingService_, _AnalyticsDataLayerService_, _AnalyticsConfigService_, _$compile_, _$state_, _$rootScope_) {
      AnalyticsTrackingService = _AnalyticsTrackingService_;
      AnalyticsDataLayerService = _AnalyticsDataLayerService_;
      $compile = _$compile_;
      $state = _$state_;
      $scope = _$rootScope_.$new();
    }));

    describe('Event tracking', function() {
      it('should track event with the label from element', function() {
        // given
        var element = angular.element('<button at-ng-event-tracking="labelValue"></button>');
        $state.current.name = 'a';
        spyOn(AnalyticsTrackingService, 'trackEvent');

        // when
        var compiled = $compile(element)($scope);
        $scope.$apply();
        compiled.triggerHandler('click');

        // then
        expect(AnalyticsTrackingService.trackEvent).toHaveBeenCalledWith('a', 'labelValue');
      });

      it('should set custom dimensions provided in attribute', function() {
        // given
        $scope.dimensionValueInScope = 'dimensionValue';
        var element = angular.element('<button at-ng-event-tracking="labelValue" at-ng-event-tracking-data="{\'dimensionVar\':dimensionValueInScope}"></button>');
        $state.current.name = 'a';
        spyOn(AnalyticsDataLayerService, 'setVar');
        spyOn(AnalyticsTrackingService, 'trackEvent');

        // when
        var compiled = $compile(element)($scope);
        $scope.$apply();
        compiled.triggerHandler('click');

        // then
        expect(AnalyticsDataLayerService.setVar).toHaveBeenCalledWith('dimensionVar', 'dimensionValue');
        expect(AnalyticsTrackingService.trackEvent).toHaveBeenCalledWith('a', 'labelValue');
      });

      it('should track event before other click handlers are resolved', function() {
        // given
        $scope.dimensionValueInScope = 'dimensionValue';
        $scope.changer = function() {
          $scope.dimensionValueInScope = 'changed';
        };
        var element = angular.element('<button ng-click="changer()" at-ng-event-tracking="labelValue" at-ng-event-tracking-data="{\'dimensionVar\':dimensionValueInScope}"></button>');
        $state.current.name = 'a';
        spyOn(AnalyticsDataLayerService, 'setVar');
        spyOn(AnalyticsTrackingService, 'trackEvent');

        // when
        var compiled = $compile(element)($scope);
        $scope.$apply();
        compiled.triggerHandler('click');

        // then
        expect(AnalyticsDataLayerService.setVar).toHaveBeenCalledWith('dimensionVar', 'dimensionValue');
        expect(AnalyticsTrackingService.trackEvent).toHaveBeenCalledWith('a', 'labelValue');
      });
    });
  });
}());
