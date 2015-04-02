var tape = require('tape');
var diff = require('../');
var tests = require('./tests.json');
var path = require('path');

tests.forEach(function(test) {
  var files = test.files.map(function(file) {
    return path.resolve(__dirname, file);
  });

  var diffs = [];
  var failed = false;

  tape('Test diffing ' + test.files.join(' & '), function(t) {
    diff(files[0], files[1])
      .on('diff', function(d) {
        diffs.push(d);
      })
      .on('error', function(error) {
        failed = true;
        t.fail(error);
        t.end();
      })
      .on('end', function() {
        if (!failed) {
          t.equal(JSON.stringify(diffs), JSON.stringify(test.results));
          t.end();
        }
      });
  });
});
