var events = require('events');
var split = require('split2');
var diff2js = require('./diff2js');
var spawn = require('child_process').spawn;

var H = require('highland')

function callS(f1, f2) {
  var cmd = spawn('diff', [f1, f2]);
  return H(H(cmd.stdout)
	.splitBy('\n')
	.pipe(diff2js()))
}

function call(f1, f2, opts) {
  // returns a stream when asked to do so
  if(opts && opts.stream)
    return callS(f1, f2, opts)

  var diff = new events.EventEmitter();
  var command = spawn('diff', [f1, f2]);
  command.stdout
    .pipe(split())
    .pipe(diff2js())
    .on('data', function(line) {
      diff.emit('diff', line);
    })
    .on('end', function() {
      diff.emit('end');
    });

  command.on('stderr', function(error) {
    diff.emit('error', error);
  });

  command.on('exit', function(code) {
    if (code == 2) {
      // diff error:
      // http://stackoverflow.com/questions/6971284/what-are-the-error-exit-values-for-diff
      diff.emit('error', 'diff error');
    }
  });

  return diff;
}

module.exports = call;
