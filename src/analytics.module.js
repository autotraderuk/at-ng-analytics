(function() {
  'use strict';

  angular.module('at.ng.analytics', [
    'angulartics',
    'angulartics.google.analytics',
    'ui.router'
  ]);

  module.exports = angular.module('at.ng.analytics');
}());
