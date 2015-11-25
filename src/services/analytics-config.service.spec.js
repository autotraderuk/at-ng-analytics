(function() {
  'use strict';

  var KarmaTestTool = require('karma-test-tool');

  describe('AnalyticsConfigServiceTest', function () {
    var AnalyticsConfigService, AnalyticsProperties, testComponents;

    beforeEach(function () {
      testComponents = new KarmaTestTool()
        .module('at.ng.analytics')
        .service(['AnalyticsConfigService', 'AnalyticsProperties'])
        .withScope()
        .build();

      AnalyticsConfigService = testComponents.service('AnalyticsConfigService');
      AnalyticsProperties = testComponents.service('AnalyticsProperties');
    });

    describe('config validation on', function() {
      beforeEach(function () {
        AnalyticsProperties.validateConfiguration = true;
      });

      describe('registerCustomDimensions', function () {
        it('schema should accept regression file', function(){
          //given
          var regression = require('../schemas/custom-dimensions.regression');

          //when
          AnalyticsConfigService.registerCustomDimensions(regression);

          //then
          expect(AnalyticsConfigService.getCustomDimensions()).toBe(regression);
        });

        it('schema should reject incorrect format', function(){
          //given
          var regression = {not:'matching'};

          //then
          expect(function(){AnalyticsConfigService.registerCustomDimensions(regression)}).toThrow(new Error([{"field":"data","message":"is the wrong type"}]));
        });
      });

      describe('registerEvents', function () {
        it('schema should accept regression file', function(){
          //given
          var regression = require('../schemas/events.regression');

          //when
          AnalyticsConfigService.registerEvents(regression);

          //then
          expect(AnalyticsConfigService.getEvents()).toBe(regression);
        });

        it('schema should reject incorrect format', function(){
          //given
          var regression = {not:'matching'};

          //then
          expect(function(){AnalyticsConfigService.registerEvents(regression)}).toThrow(new Error([{"field":"data","message":"is the wrong type"}]));
        });
      });

      describe('registerPages', function () {
        it('schema should accept regression file', function(){
          //given
          var regression = require('../schemas/pages.regression');

          //when
          AnalyticsConfigService.registerPages(regression);

          //then
          expect(AnalyticsConfigService.getPages()).toBe(regression);
        });

        it('schema should reject incorrect format', function(){
          //given
          var regression = {not:'matching'};

          //then
          expect(function(){AnalyticsConfigService.registerPages(regression)}).toThrow(new Error([{"field":"data","message":"is the wrong type"}]));
        });
      });
    });

    describe('config validation off', function() {
      beforeEach(function () {
        AnalyticsProperties.validateConfiguration = false;
      });

      describe('registerCustomDimensions', function () {
        it('should accept any input', function(){
          //given
          var regression = {not:'matching'};

          //when
          AnalyticsConfigService.registerCustomDimensions(regression);

          //then
          expect(AnalyticsConfigService.getCustomDimensions()).toBe(regression);
        });
      });

      describe('registerEvents', function () {
        it('should accept any input', function(){
          //given
          var regression = {not:'matching'};

          //when
          AnalyticsConfigService.registerEvents(regression);

          //then
          expect(AnalyticsConfigService.getEvents()).toBe(regression);
        });
      });

      describe('registerPages', function () {
        it('should accept any input', function(){
          //given
          var regression = {not:'matching'};

          //when
          AnalyticsConfigService.registerPages(regression);

          //then
          expect(AnalyticsConfigService.getPages()).toBe(regression);
        });
      });
    });
  });
}());