# at-ng-analytics
A library for page and event tracking with configurable custom dimensions

Installation
------------

Add the following line to your `package.json` dependencies.

`"at-ng-analytics": "http://nexus.dev.dc1.tradermedia.net:8081/nexus/content/repositories/npm-internal/at-ng-analytics/-/at-ng-analytics-0.2.1.tgz",`

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

The library accepts configuration in the form of JSON objects (a full description of valid configuration is provided below), which should registered using the AnalyticsConfigService.

```js
var app = require('../app.module');

/* @ngInject */
function AnalyticsSetup(AnalyticsConfigService) {
  AnalyticsConfigService.registerCustomDimensions(require('./custom-dimensions.json'));
  AnalyticsConfigService.registerEvents(require('./events.json'));
  AnalyticsConfigService.registerPages(require('./pages.json'));
}

app.run(AnalyticsSetup);
```
