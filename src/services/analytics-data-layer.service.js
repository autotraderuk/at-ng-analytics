(function() {
  'use strict';

  var analyticsModule = require('../analytics.module');

  function AnalyticsDataLayerService() {
    var data = {};
    var service = {
      getVar: getVar,
      setVar: setVar
    };
    return service;

    function getVar(id) {
      return data[id];
    }

    function setVar(id, value) {
      data[id] = value;
    }
  }

  analyticsModule.service('AnalyticsDataLayerService', AnalyticsDataLayerService);
  module.exports = AnalyticsDataLayerService;
}());
