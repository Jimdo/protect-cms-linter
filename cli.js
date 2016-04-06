#!/usr/bin/env node

/* eslint no-process-exit: 0, no-process-env: 0, no-console: 0 */

'use strict';

var path = require('path');
var fs = require('fs');
var Linter = require('./index');
var linter = new Linter();
var cssFileArgPos = 2;
var sourcemapArgPos = 3;
var inputFiles = [];

function readFile(filePath) {
  const resolvedFilePath = path.resolve(filePath);

  return new Promise((resolve, reject) => {
    fs.exists(resolvedFilePath, (exists) => {
      if (!exists) {
        return resolve(false);
      }

      fs.readFile(path.resolve(filePath), 'utf-8', (err, content) => {
        if (err) {
          return reject(err);
        }
        resolve(content);
      });
    });
  });
}

inputFiles.push(readFile(process.argv[cssFileArgPos]));
if (process.argv[sourcemapArgPos]) {
  inputFiles.push(readFile(process.argv[sourcemapArgPos]));
}

Promise.all(inputFiles).then((contents) => {
  var rawSourcemapJSON = null;
  var result = null;

  if (!contents[0]) {
    throw new Error('CSS file not found');
  }

  if (contents[1]) {
    rawSourcemapJSON = JSON.parse(contents[1]);
  }

  result = linter.lint(contents[0], rawSourcemapJSON);

  if (result.status !== Linter.CONSTANTS.STATUS_OK) {
    throw result;
  }

  console.log('OK!');
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
