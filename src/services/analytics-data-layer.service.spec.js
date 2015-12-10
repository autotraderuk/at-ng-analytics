(function() {
  'use strict';

  var KarmaTestTool = require('karma-test-tool');

  describe('AnalyticsDataLayerServiceTest', function () {
    var AnalyticsDataLayerService, AnalyticsProperties, $state, testComponents;

    beforeEach(function () {
      testComponents = new KarmaTestTool()
        .module('at.ng.analytics')
        .service(['AnalyticsDataLayerService', 'AnalyticsProperties', '$state'])
        .withScope()
        .build();

      AnalyticsDataLayerService = testComponents.service('AnalyticsDataLayerService');
      AnalyticsProperties = testComponents.service('AnalyticsProperties');
      $state = testComponents.service('$state');
    });

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