# at-ng-analytics
A library for page and event tracking with configurable custom dimensions.

The purpose of this library is to provide a central place where you may configure the GA tracking for your application, including which custom dimensions are sent with each tracking payload.

If you are using ui-router then configuring at-ng-analytics will give you page tracking by default. In addition event tracking is possible by adding directives to the elements on page you want to track the actions of.

Installation
------------

Add the following line to your `package.json` dependencies.

`"at-ng-analytics": "http://nexus.dev.dc1.tradermedia.net:8081/nexus/content/repositories/npm-internal/at-ng-analytics/-/at-ng-analytics-1.0.1.tgz",`

In `index.js` (or wherever you are requiring modules) add the following line

`require('at-ng-analytics');`

In `app.module.js` (or wherever you define your app module and dependencies) add `'at.ng.analytics'` to the dependencies, e.g.
 
```js
angular.module('my.app', [
  'at.ng.analytics'
]);
```

Setup
------------

The library accepts configuration in the form of JSON objects, which should registered using the `AnalyticsConfigService`.

```js
AnalyticsConfigService.registerCustomDimensions(require('./my-custom-dimensions.json'));
AnalyticsConfigService.registerPages(require('./my-pages.json'));
AnalyticsConfigService.registerEvents(require('./my-events.json'));
```

By default the configuration objects are validated against schemas upon registration. Schemas can be found here:

[Custom Dimensions](src/schemas/custom-dimensions.schema.json)

[Pages](src/schemas/pages.schema.json)

[Events](src/schemas/events.schema.json)

You can turn off this validation with the `AnalyticsProperties`.

```js
AnalyticsProperties.validateConfiguration = false;
```

#### Custom Dimensions Config

The custom dimensions config object is an array of objects describing all custom dimensions used across your app.

A dimension can either have a static value or a variable name, which will be used to locate a value in the data layer.

```js
[
  {
    "id" : 1,
    "name" : "Dimension 1",
    "value" : "value1"              // static value
  },
  {
    "id" : 2,
    "name" : "Dimension 2",
    "dataLayerVar" : "dimensionVar" // value from data layer
  }
]
```

The `id` field should relate to the custom dimension id you are using in GA. So `"id" : 1` will be sent as `dimension1`.

#### Pages Config

The pages config object describes the pages in your application along with any events on those pages that are to be tracked.

```js
[
  {
    "name": "Page 1",
    "state": "pg1",
    "customDimensions": ["Dimension 1", "Dimension 2"]
  },
  {
    "name": "Page 2",
    "state": "pg2",
    "customDimensions": ["Dimension 1", "Dimension 2"],
    "defaultDataLayerValues": {
     "dimensionVar": "dimensionValue"
    },
    "events": [
      {
        "name": "Event 1",
        "category": "standard-link",
        "label": "event1"                // static value
      },
      {
        "name": "Event 2",
        "category": "standard-link",
        "label": "event2",
        "labelDataLayerVar": "eventVar"  // value from data layer
      },
      {
        "name": "Event 3",
        "category": "standard-link",
        "label": "event3",
        "customDimensions": ["Dimension 3"]
      }
    ]
  }
]
```

If your application is using `ui-router` then page tracking, including custom dimensions, will automatically be sent for each page. The `state` field should match exactly the name given to the `ui-router` `$stateProvider` when configuring your states.

Event tracking for items on the page will include the custom dimensions configured for the page as well as any configured just for the event e.g. Event 3 will be sent with custom dimensions 1, 2 and 3. The label value for event tracking may be obtained dynamically from the data layer by adding a `labelDataLayerVar` field.

You may optionally provide a set of default values for the data layer for each page using `defaultDataLayerValues`. If the data layer doesn't hold a value for the variable when an event or page is tracked then the default will be used instead. This feature is also useful for setting data layer variables that are static per page.

#### Events Config

The events config object describes any global events you are tracking.

```js
[
  {
    "name": "Event 1",
    "category": "navigation",
    "label": "event1"                 // static value
  },
  {
    "name": "Event 2",
    "category": "navigation",
    "label": "event2",
    "labelDataLayerVar": "eventVar"   // value from data layer
  },
  {
    "name": "Event 3",
    "category": "standard-link",
    "label": "event3",
    "customDimensions": ["Dimension 3"]
  }
]
```

Some events aren't limited to a single page (e.g. menu bar click events) so can be configured here. When these events are tracked they will include the custom dimensions for the current page as well as any configured just for the event.

Data Layer
----------

Values can be put into the the data layer using the `AnalyticsDataLayerService`.

```js
AnalyticsDataLayerService.setVar('dimensionVar', 'dimensionValue');
```

The best place to set variables that will be used in page tracking is in the init method of your controllers as these will be resolved before page tracking is triggered.

Event Tracking
--------------

The `at-ng-event-tracking` directive will enable click tracking on elements of your page.

```html
<button at-ng-event-tracking="labelValue">Click Me</button>
```

The value given to the directive must match the value of the `label` field for the event in your config.

Often a data layer variable needs setting before the event tracking is performed. The `at-ng-event-tracking-data` attribute takes an object that will be merged to the data layer before event tracking is triggered.

```html
<button at-ng-event-tracking="labelValue" at-ng-event-tracking-data="{\'dimensionVar\':scopeValue}">Click Me</button>
```

Manual Tracking
---------------

The `AnalyticsTrackingService` may be used to manually send tracking.

```js
AnalyticsTrackingService.trackPageView('stateName');
AnalyticsTrackingService.trackEvent('stateName', 'eventLabel');
```

License
-------

The MIT License (MIT)
Copyright (c) 2016 Auto Trader Limited

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
