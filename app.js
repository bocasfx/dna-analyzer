'use strict';

const fs              = require('fs');
const Sequence        = require('./Sequence');
const chalk           = require('chalk');
const DNAEncoder   = require('./DNAEncoder');
const DNADecoder = require('./DNADecoder');
const argv            = require('minimist')(process.argv.slice(2));

var command = argv._[0] || null;

if (!command) {
  console.log('Please specify a command.');
  return;
}

function encode(fileName, encoding) {
  var stream1 = fs.createReadStream(fileName, { encoding: encoding});
  var dnaEncoder = new DNAEncoder();
  var wstream = fs.createWriteStream(fileName + '.hex', {encoding: 'hex'});
  stream1.pipe(dnaEncoder)
         .pipe(wstream);
}

function decode(fileName, encoding) {
  var stream1 = fs.createReadStream(fileName, { encoding: 'hex'});
  var dnaDecoder = new DNADecoder();
  var wstream = fs.createWriteStream(fileName + '.unc', {encoding: encoding});
  stream1.pipe(dnaDecoder)
         .pipe(wstream);
}

function compare(fileName1, fileName2, encoding) {
  var stream1 = fs.createReadStream(fileName1, { encoding: encoding});
  var stream2 = fs.createReadStream(fileName2, { encoding: encoding});

  var seq1 = new Sequence(stream1);
  var seq2 = new Sequence(stream2);

  seq1.compare(seq2).then((result)=> {
    if (result) {
      console.log('Sequences match');
    } else {
      console.log('Sequences do not match');
    }
  });
}

var err = chalk.red('Error');

switch (command) {
  
  case 'encode':
    if (argv._.length < 3) {
      console.log(`${err} Insuficient arguments`);
      break;
    }
    encode(argv._[1], argv._[2]);
    break;

  case 'decode':
    if (argv._.length < 3) {
      console.log(`${err} Insuficient arguments`);
      break;
    }
    decode(argv._[1], argv._[2]);
    break;
  
  case 'compare':
    if (argv._.length < 4) {
      console.log(`${err} Insuficient arguments`);
      break;
    }
    compare(argv._[1], argv._[2], argv._[3]);
    break;
  
  default:
    let cmd = chalk.cyan(command);
    console.log(`${err} Unknown command ${cmd}`);
}
