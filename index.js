var events = require('events'),
    split = require('split2'),
    diff2js = require('./diff2js'),
    spawn = require('child_process').spawn;

function call(f1, f2) {
  var diff = new events.EventEmitter(),
      command = spawn('diff', [f1, f2]);

  command.stdout
    .pipe(split())
    .pipe(diff2js())
    .on('data', function (line) {
      diff.emit('diff', line);
    })
    .on('end', function () {
      diff.emit('end');
    });

  command.on('stderr', function (error) {
    diff.emit('error', error);
  });

  // command.on('exit', function (code) {
  //   console.log('child process exited with code ' + code);
  // });

  return diff;
}

module.exports = call;
