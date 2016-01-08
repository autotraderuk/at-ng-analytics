(function() {
  'use strict';

  describe('AnalyticsDataLayerServiceTest', function () {
    var AnalyticsDataLayerService, AnalyticsProperties, $state;

    beforeEach(function() {
      angular.mock.module('at.ng.analytics');
    });

    beforeEach(inject(function (_AnalyticsDataLayerService_, _AnalyticsProperties_, _$state_) {
      AnalyticsDataLayerService = _AnalyticsDataLayerService_;
      AnalyticsProperties = _AnalyticsProperties_;
      $state = _$state_;
    }));

    it('AnalyticsDataLayerService should return value from own data', function(){
      //given
      AnalyticsDataLayerService.setVar('variableId','testValue');

      //when
      var result = AnalyticsDataLayerService.getVar("variableId");

      //then
      expect(result).toBe('testValue');
    });
  });
}());