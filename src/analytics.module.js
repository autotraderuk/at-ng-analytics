(function() {
  'use strict';

  angular.module('at.ng.analytics', [
    'angulartics',
    'angulartics.google.analytics',
    'angulartics.debug'
  ]);

  module.exports = angular.module('at.ng.analytics');
}());
