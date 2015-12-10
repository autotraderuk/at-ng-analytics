(function() {
  'use strict';

  var KarmaTestTool = require('karma-test-tool');

  describe('AnalyticsTrackingServiceTest', function () {
    var AnalyticsTrackingService, $analytics, AnalyticsConfigService, AnalyticsDataLayerService, testComponents;

    beforeEach(function () {
      testComponents = new KarmaTestTool()
        .module('at.ng.analytics')
        .service(['AnalyticsTrackingService', '$analytics', 'AnalyticsConfigService', 'AnalyticsDataLayerService'])
        .withScope()
        .build();

      AnalyticsTrackingService = testComponents.service('AnalyticsTrackingService');
      $analytics = testComponents.service('$analytics');
      AnalyticsConfigService = testComponents.service('AnalyticsConfigService');
      AnalyticsDataLayerService = testComponents.service('AnalyticsDataLayerService');
    });

    var customDimensions = [
      {
        "id" : 4,
        "name" : "Dimension 4",
        "value" : "value4"
      },
      {
        "id" : 5,
        "name" : "Dimension 5",
        "value" : "value5"
      },
      {
        "id" : 6,
        "name" : "Dimension 6",
        "dataLayerVar" : "dimensionVar"
      }
    ];

    describe('track page view', function () {

      it('should set custom dimension from config', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
            {
              "name": "Page B",
              "state": "b",
              "customDimensions": ['Dimension 4', 'Dimension 5']
            }
          ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn($analytics, 'setUserProperties');
        spyOn($analytics, 'pageTrack');
        window.location.hash = 'trackedHash';

        //when
        AnalyticsTrackingService.trackPageView('b');

        //then
        expect($analytics.setUserProperties).toHaveBeenCalledWith({ dimension4: 'value4', dimension5: 'value5' });
        expect($analytics.pageTrack).toHaveBeenCalledWith('#trackedHash');
      });

      it('should set custom dimension from data layer', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 6']
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn(AnalyticsDataLayerService, 'getVar').and.returnValue('value6');
        spyOn($analytics, 'setUserProperties');
        spyOn($analytics, 'pageTrack');
        window.location.hash = 'trackedHash';

        //when
        AnalyticsTrackingService.trackPageView('b');

        //then
        expect(AnalyticsDataLayerService.getVar).toHaveBeenCalledWith('dimensionVar');
        expect($analytics.setUserProperties).toHaveBeenCalledWith({ dimension6: 'value6' });
        expect($analytics.pageTrack).toHaveBeenCalledWith('#trackedHash');
      });

      it('should set custom dimension from data layer defaults', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 6'],
            "dataLayerDefaults": {"dimensionVar": "value6"}
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn(AnalyticsDataLayerService, 'getVar').and.returnValue(undefined);
        spyOn($analytics, 'setUserProperties');
        spyOn($analytics, 'pageTrack');
        window.location.hash = 'trackedHash';

        //when
        AnalyticsTrackingService.trackPageView('b');

        //then
        expect(AnalyticsDataLayerService.getVar).toHaveBeenCalledWith('dimensionVar');
        expect($analytics.setUserProperties).toHaveBeenCalledWith({ dimension6: 'value6' });
        expect($analytics.pageTrack).toHaveBeenCalledWith('#trackedHash');
      });

      it('should not set custom dimension if it cant be found in data layer', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 6']
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn(AnalyticsDataLayerService, 'getVar').and.returnValue(undefined);
        spyOn($analytics, 'setUserProperties');
        spyOn($analytics, 'pageTrack');
        window.location.hash = 'trackedHash';

        //when
        AnalyticsTrackingService.trackPageView('b');

        //then
        expect(AnalyticsDataLayerService.getVar).toHaveBeenCalledWith('dimensionVar');
        expect($analytics.setUserProperties).toHaveBeenCalledWith({});
        expect($analytics.pageTrack).toHaveBeenCalledWith('#trackedHash');
      });
    });

    describe('track event', function () {

      it('should set page custom dimension from config', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4', 'Dimension 5'],
            "events": [
              {
                "name": "An Event",
                "category": "link",
                "label": "event1"
              }
            ]

          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn($analytics, 'eventTrack');

        //when
        AnalyticsTrackingService.trackEvent('b', 'event1');

        //then
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { dimension4: 'value4', dimension5: 'value5', category: 'link', action: 'click', label: 'event1' });
      });

      it('should set page custom dimension from data layer', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 6'],
            "events": [
              {
                "name": "An Event",
                "category": "link",
                "label": "event1"
              }
            ]
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn(AnalyticsDataLayerService, 'getVar').and.returnValue('value6');
        spyOn($analytics, 'eventTrack');

        //when
        AnalyticsTrackingService.trackEvent('b', 'event1');

        //then
        expect(AnalyticsDataLayerService.getVar).toHaveBeenCalledWith('dimensionVar');
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { dimension6: 'value6', category: 'link', action: 'click', label: 'event1' });
      });

      it('should set event custom dimension from config', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4'],
            "events": [
              {
                "name": "An Event",
                "category": "link",
                "label": "event1",
                "customDimensions": ['Dimension 5']
              }
            ]

          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn($analytics, 'eventTrack');

        //when
        AnalyticsTrackingService.trackEvent('b', 'event1');

        //then
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { dimension4: 'value4', dimension5: 'value5', category: 'link', action: 'click', label: 'event1' });
      });

      it('should set event custom dimension from data layer', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4'],
            "events": [
              {
                "name": "An Event",
                "category": "link",
                "label": "event1",
                "customDimensions": ['Dimension 6']
              }
            ]
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn(AnalyticsDataLayerService, 'getVar').and.returnValue('value6');
        spyOn($analytics, 'eventTrack');

        //when
        AnalyticsTrackingService.trackEvent('b', 'event1');

        //then
        expect(AnalyticsDataLayerService.getVar).toHaveBeenCalledWith('dimensionVar');
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { dimension4: 'value4', dimension6: 'value6', category: 'link', action: 'click', label: 'event1' });
      });

      it('should set event custom dimension from data layer defaults', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4'],
            "dataLayerDefaults": {"dimensionVar": "value6"},
            "events": [
              {
                "name": "An Event",
                "category": "link",
                "label": "event1",
                "customDimensions": ['Dimension 6']
              }
            ]
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn(AnalyticsDataLayerService, 'getVar').and.returnValue(undefined);
        spyOn($analytics, 'eventTrack');

        //when
        AnalyticsTrackingService.trackEvent('b', 'event1');

        //then
        expect(AnalyticsDataLayerService.getVar).toHaveBeenCalledWith('dimensionVar');
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { dimension4: 'value4', dimension6: 'value6', category: 'link', action: 'click', label: 'event1' });
      });

      it('should set event label from data layer', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4'],
            "events": [
              {
                "name": "An Event",
                "category": "link",
                "label": "event1",
                "labelDataLayerVar": "labelVar"
              }
            ]
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn(AnalyticsDataLayerService, 'getVar').and.returnValue('labelValue');
        spyOn($analytics, 'eventTrack');

        //when
        AnalyticsTrackingService.trackEvent('b', 'event1');

        //then
        expect(AnalyticsDataLayerService.getVar).toHaveBeenCalledWith('labelVar');
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { dimension4: 'value4', category: 'link', action: 'click', label: 'labelValue' });
      });

      it('should get global event settings from config', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4']

          }
        ]);
        spyOn(AnalyticsConfigService, 'getEvents').and.returnValue([
          {
            "name": "An Event",
            "category": "link",
            "label": "event1",
            "customDimensions": ['Dimension 5']
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn($analytics, 'eventTrack');

        //when
        AnalyticsTrackingService.trackEvent('b', 'event1');

        //then
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { dimension4: 'value4', dimension5: 'value5', category: 'link', action: 'click', label: 'event1' });
      });
    });
  });
}());