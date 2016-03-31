'use strict';

const stream = require('stream');
const debug  = require('debug')('DNAEncoder');

class DNAEncoder extends stream.Transform {
  constructor() {
    super({
      highWaterMark: 65535,
      objectMode: true
    });

    this.genomes = {
      g: 0x00,
      a: 0x01,
      t: 0x02,
      c: 0x03
    };
  }

  _transform(chunk, encoding, done) {
    let encodedChunk = this.encode(chunk);
    this.push(encodedChunk);
    done();
  }

  _flush(done) {
    debug('Flushing');
    done();
  }

  encode(chunk) {
    debug(`Encoding chunk: ${chunk.length}`);
    // Stores four letters per byte.
    var buffer = new Buffer(chunk.length / 4);
    
    var offset = 0;

    for (var i=0; i<chunk.length; i+=4) {

      var b0 = this.genomes[chunk[i]]   << 6;
      var b1 = this.genomes[chunk[i+1]] << 4;
      var b2 = this.genomes[chunk[i+2]] << 2;
      var b3 = this.genomes[chunk[i+3]];

      var quad = b0 | b1 | b2 | b3;

      buffer.writeUInt8(quad, offset, 1);
      offset++;
    }

    return buffer;
  }
}

module.exports = DNAEncoder;