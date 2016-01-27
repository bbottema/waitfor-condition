waitfor-condition
=========

A simple utility that waits until a custom condition is met or until timeout.

## Example

The following gulp example will start a wiremock server and delay the jasmine tests until wiremock is finished booting.

```javascript
var gulp = require('gulp');
var waitFor = require('gulp-waitfor');
var request = require('request');

gulp.task('run-e2e', function () {
    return gulp
        .exec('java -jar ./lib/wiremock-standalone.jar --your-options')
        .pipe(waitFor(function (cb) {
            request('http://localhost:1235/service/your-mock-service', function (error, response) {
                cb(!error && response.statusCode === 200);
            });
        }))
        .pipe(... /* run jasmine tests or simply got to the next task */);
});
```

## Options

There are two ways to invoke gulp-waitfor:

**Basic:**

```javascript
waitFor(function(cb) { /* cb(condition satisfied boolean)  */}, [timeoutMs], [intervalMs])
```

**Config object:**

```javascript
waitFor({
  before: function() { },
  condition: function(cb) { /* cb(condition satisfied boolean)  */},
  after: function(succes) { },
  interval: 500ms, // default is 500
  timeout: 60000ms, // default is 1 minute
  verbose: false, // default is true (false silences logging)
})
```
