'use strict';

const debug = require('debug')('Sequence');
const Q     = require('q');

class Sequence {
  constructor(stream) {
    this.stream = stream;
    this.stream.on('data', this.onData.bind(this));
    this.stream.on('close', this.onClosed.bind(this));
    this.empty = false;
    this.dfrd = null;
  }

  read() {
    this.deferred = Q.defer();
    return this.deferred.promise;
  }

  onData(chunk) {
    this.deferred.resolve(chunk);
  }

  compare(seq2) {
    this.dfrd = Q.defer();
    this.compareWith(seq2);
    return this.dfrd.promise;
  }

  compareWith(seq2) {

    var self = this;

    Q.all([this.read(), seq2.read()])
      .then((values)=> {
        debug(`Comparing chunk: ${values[0].length}`);
        if (values[0] === values[1]) {
          self.compareWith(seq2);
        } else {
          self.dfrd.resolve(false);
        }
      });
  }

  onClosed() {
    if (this.dfrd) {
      this.dfrd.resolve(true);
    }
  }
}

module.exports = Sequence;