'use strict';

const stream = require('stream');
const debug  = require('debug')('DNADecoder');

class DNADecoder extends stream.Transform {
  constructor() {
    super({
      highWaterMark: 65535,
      objectMode: true
    });

    this.genomes = {
      0: 'g',
      1: 'a',
      2: 't',
      3: 'c'
    };
  }

  _transform(chunk, encoding, done) {
    let decodedChunk = this.decode(chunk);
    this.push(decodedChunk);
    done();
  }

  _flush(done) {
    debug('Flushing');
    done();
  }

  decode(chunk) {
    var buffer = new Buffer(chunk, 'hex');
    var decodedChunk = '';

    for (var i=0; i<chunk.length / 2; i++) {

      let quad = buffer.readUInt8(i);

      let b0 = (quad & 192) >> 6;
      let b1 = (quad & 48)  >> 4;
      let b2 = (quad & 12)  >> 2;
      let b3 = (quad & 3);
      
      let g0 = this.genomes[b0];
      let g1 = this.genomes[b1];
      let g2 = this.genomes[b2];
      let g3 = this.genomes[b3];
      decodedChunk = `${decodedChunk}${g0}${g1}${g2}${g3}`;
    }

    return decodedChunk;
  }
}

module.exports = DNADecoder;