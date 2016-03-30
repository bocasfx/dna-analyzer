'use strict';

const fs            = require('fs');
const Sequence      = require('./Sequence');
const debug         = require('debug')('Main');
const DNACompressor = require('./DNACompressor');

function compress(fileName) {
  var stream1 = fs.createReadStream(fileName, { encoding: 'utf8'});
  var dnaCompressor = new DNACompressor();
  var wstream = fs.createWriteStream(fileName + '.hex', {encoding: 'binary'});
  stream1.pipe(dnaCompressor).pipe(wstream);
}

function compare(fileName1, fileName2, encoding) {
  var stream1 = fs.createReadStream(fileName1, { encoding: encoding});
  var stream2 = fs.createReadStream(fileName2, { encoding: encoding});

  var seq1 = new Sequence(stream1);
  var seq2 = new Sequence(stream2);

  seq1.compare(seq2).then((result)=> {
    debug(result);
  });
}

compress('dna1.txt');
compare('dna1.txt', 'dna2.txt', 'binary');
