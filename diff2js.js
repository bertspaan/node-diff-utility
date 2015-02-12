'use strict';

var through = require('through2')

function transform(line, enc, cb) {
  var match = this._reChangeCommand.exec(line);
  if (match) {
    this._lastLineOut = parseInt(match[1]);
    this._lastLineIn = parseInt(match[3]);
    this._lastChange =   this._changes[match[2]];
  } else {
    var first = line.charAt(0);
    if (first === "<") {

      push(this, {
        change: this._lastChange,
        line: this._lastLineOut,
        type: "out",
        str: line.substring(2)
      });

      this._lastLineOut += 1;
    } else if (first === ">") {

      push(this, {
        change: this._lastChange,
        line: this._lastLineIn,
        type: "in",
        str: line.substring(2)
      });

      this._lastLineIn += 1;
    }
  }
  cb();
}

function flush(cb) {
  cb();
}

function push(self, val) {
  if (val !== undefined) {
    self.push(val);
  }
}

function diff2js() {
  var stream = through({}, transform, flush);

  stream._writableState.objectMode = true;
  stream._readableState.objectMode = true;

  stream._lastLineIn = 0;
  stream._lastLineOut = 0;
  stream._lastChange = null;
  stream._reChangeCommand = /^(\d+)(?:\,\d+)?([a,c,d])(\d+)(?:\,\d+)?/;
  stream._changes = {
    a: "add",
    c: "change",
    d: "delete"
  }

  return stream;
}

module.exports = diff2js;
