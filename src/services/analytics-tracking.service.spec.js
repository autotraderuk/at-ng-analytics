(function() {
  'use strict';

  describe('AnalyticsTrackingServiceTest', function () {
    var AnalyticsTrackingService, $analytics, AnalyticsProperties, AnalyticsConfigService, AnalyticsDataLayerService;

    beforeEach(function() {
      angular.mock.module('at.ng.analytics');
    });

    beforeEach(inject(function (_AnalyticsTrackingService_, _AnalyticsProperties_,_AnalyticsDataLayerService_, _AnalyticsConfigService_, _$analytics_) {
      AnalyticsTrackingService = _AnalyticsTrackingService_;
      AnalyticsProperties = _AnalyticsProperties_;
      AnalyticsDataLayerService = _AnalyticsDataLayerService_;
      AnalyticsConfigService = _AnalyticsConfigService_;
      $analytics = _$analytics_;
    }));

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
        expect($analytics.setUserProperties).toHaveBeenCalledWith({ 'Dimension 4': 'value4', 'Dimension 5': 'value5' });
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
        expect($analytics.setUserProperties).toHaveBeenCalledWith({ 'Dimension 6': 'value6' });
        expect($analytics.pageTrack).toHaveBeenCalledWith('#trackedHash');
      });

      it('should set custom dimension from data layer defaults', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 6'],
            "defaultDataLayerValues": {"dimensionVar": "value6"}
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
        expect($analytics.setUserProperties).toHaveBeenCalledWith({ 'Dimension 6': 'value6' });
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 4': 'value4', 'Dimension 5': 'value5', category: 'link', action: 'click', label: 'event1' });
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 6': 'value6', category: 'link', action: 'click', label: 'event1' });
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 4': 'value4', 'Dimension 5': 'value5', category: 'link', action: 'click', label: 'event1' });
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 4': 'value4', 'Dimension 6': 'value6', category: 'link', action: 'click', label: 'event1' });
      });

      it('should set event custom dimension from data layer defaults', function(){
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4'],
            "defaultDataLayerValues": {"dimensionVar": "value6"},
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 4': 'value4', 'Dimension 6': 'value6', category: 'link', action: 'click', label: 'event1' });
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 4': 'value4', category: 'link', action: 'click', label: 'labelValue' });
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 4': 'value4', 'Dimension 5': 'value5', category: 'link', action: 'click', label: 'event1' });
      });
    });

    describe('with includeIndexIdentifiedCustomDimensions enabled', function () {

      beforeEach(function(){
        AnalyticsProperties.includeIndexIdentifiedCustomDimensions = true;
      });

      it('track page view should send index identified custom dimensions', function () {
        //given
        spyOn(AnalyticsConfigService, 'getPages').and.returnValue([
          {
            "name": "Page B",
            "state": "b",
            "customDimensions": ['Dimension 4']
          }
        ]);
        spyOn(AnalyticsConfigService, 'getCustomDimensions').and.returnValue(customDimensions);
        spyOn($analytics, 'setUserProperties');
        spyOn($analytics, 'pageTrack');
        window.location.hash = 'trackedHash';

        //when
        AnalyticsTrackingService.trackPageView('b');

        //then
        expect($analytics.setUserProperties).toHaveBeenCalledWith({ 'Dimension 4': 'value4', dimension4: 'value4'});
        expect($analytics.pageTrack).toHaveBeenCalledWith('#trackedHash');
      });

      it('track event should send index identified custom dimensions', function(){
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
        expect($analytics.eventTrack).toHaveBeenCalledWith('click' , { 'Dimension 4': 'value4', dimension4: 'value4', category: 'link', action: 'click', label: 'event1' });
      });
    });
  });
}());