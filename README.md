waitfor-condition
=========

A simple NPM utility that waits until a custom condition is met or until timeout.

## Example

The following example will start a wiremock server and continue only when it is started properly.

```javascript
var waitForCondition = require('waitfor-condition');
var request = require('request');
var spawn = require('child_process').spawn;

spawn('java', ['-jar', './wiremock-standalone.jar', '-all-your-options', 'here'], { stdio: 'inherit' });

waitForCondition(function (cb) {
    request('http://localhost:1235/service/your-mock-service', function (error, response) {
        console.log('checking wiremock...');
        cb(!error && response.statusCode === 200);
    });
}).then(function() {
    // wiremock started, continue...
});
```

## Options

There are two ways to invoke waitfor-condition:

**Basic:**

```javascript
waitForCondition(function(cb) { /* cb(condition satisfied boolean)  */ }, [timeoutMs], [intervalMs])
```

**Config object:**

```javascript
waitForCondition({
  before: function() { },
  condition: function(cb) { /* cb(condition satisfied boolean)  */},
  after: function(succes) { },
  interval: 500ms, // default is 500
  timeout: 60000ms, // default is 1 minute
  verbose: false, // default is true (false silences logging)
})
```
