'use strict';

var _log = console.log;

var DEFAULT_TIMEOUT_MS = 60 * 1000; // 1 minute in milliseconds
var DEFAULT_INTERVAL_MS = 500; // 500 milliseconds (taken from Ant's waitFor.http condition)

module.exports = function(settingsOrCondition, timeoutOrUndefined, intervalOrUndefined) {

  var settings = (typeof settingsOrCondition === 'object' && settingsOrCondition) || {
    condition: settingsOrCondition,
    verbose: true
  };

  settings.timeout = settingsOrCondition.timeout || timeoutOrUndefined || DEFAULT_TIMEOUT_MS;
  settings.interval = settingsOrCondition.interval || intervalOrUndefined || DEFAULT_INTERVAL_MS;

  if (typeof settings.condition !== 'function') {
    throw new Error("argument should be a function or contain a function property 'condition'");
  }

  _log = settings.verbose ? _log : function() {};
  
  var deferred = require('q').defer();

  invokeBefore(settings);

  _log('waitfor-condition: started waiting until condition met or timeout (' + settings.timeout + 'ms)');

  var timedOut = false;
  var timeoutId = setTimeout(function() {
    _log('[timeout occurred]');
    timedOut = true;
  }, settings.timeout);

  var waitingForResult = false;
  var intervalId = setInterval(function() {
    _log('[interval triggered]', 'timedOut:', timedOut, 'waitingForResult:', waitingForResult);
    if (!waitingForResult) {
      waitingForResult = true;
      settings.condition(function(conditionResult) {
        if (conditionResult) {
          if (!timedOut) {
            _log('waitfor-condition: condition met result was (' + conditionResult + ')');
            finishWaitFor(true);
          }
          else {
            _log('waitfor-condition: condition met, but not before timeout (result was ' + conditionResult + ')');
          }
        }
        waitingForResult = false;
      });
    }
    else if (timedOut) {
      _log('waitfor-condition: timeout after ' + settings.timeout + ' milliseconds');
      finishWaitFor(false, new Error('timeout after ' + settings.timeout + ' milliseconds'));
    }
  }, settings.interval);
  
  return deferred.promise;

  function finishWaitFor(success, error) {
    _log('[finishWaitFor]');
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    timeoutId = intervalId = null;
    invokeAfter(settings, success);
    
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve();
    }
  }
};

function invokeBefore(settings) {
  if (typeof settings.before === 'function') {
    _log('waitfor-condition: invoking before()');
    settings.before();
  }
}

function invokeAfter(settings, success) {
  if (typeof settings.after === 'function') {
    _log('waitfor-condition: invoking after()');
    settings.after(success);
  }
}