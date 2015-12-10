(function() {
  'use strict';

  var validator = require('is-my-json-valid');

  function validateCustomDimensions(config) {
    var customDimensionsValidator = validator(require('../schemas/custom-dimensions.schema'));
    if (!customDimensionsValidator(config)) {
      throw new Error(JSON.stringify(customDimensionsValidator.errors));
    }
    checkUniqueness(config, 'name', 'Custom Dimension names are not unique');
  }

  function validateEvents(config) {
    var eventsValidator = validator(require('../schemas/events.schema'));
    if (!eventsValidator(config)) {
      throw new Error(JSON.stringify(eventsValidator.errors));
    }
    checkUniqueness(config, 'label', 'Event labels are not unique');
  }

  function validatePages(config) {
    var pagesValidator = validator(require('../schemas/pages.schema'));
    if (!pagesValidator(config)) {
      throw new Error(JSON.stringify(pagesValidator.errors));
    }
    checkUniqueness(config, 'state', 'Page states are not unique');
    for (var i = 0; i < config.length; i++) {
      if (config[i].events) {
        checkUniqueness(config[i].events, 'label', 'Event labels are not unique');
      }
    }
  }

  function checkUniqueness(objectArray, property, message) {
    var collector = [];
    for (var i = 0; i < objectArray.length; i++) {
      var value = objectArray[i][property];
      if (collector.indexOf(value) > -1) {
        throw new Error(message);
      }
      collector.push(value);
    }
  }

  module.exports = {validateCustomDimensions: validateCustomDimensions, validateEvents: validateEvents, validatePages: validatePages};
}());
