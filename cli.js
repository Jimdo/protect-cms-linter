#!/usr/bin/env node

/* eslint no-process-exit: 0, no-process-env: 0, no-console: 0 */

'use strict';

var path = require('path');
var fs = require('fs');
var Linter = require('./index');
var linter = new Linter();

fs.readFile(path.resolve(process.argv[2]), 'utf-8', (err, content) => {
  var result = null;

  if (err) {
    console.error(err);
    return process.exit(1);
  }

  result = linter.lint(content);
  console.log(result);
  if (result.status !== Linter.CONSTANTS.STATUS_OK) {
    return process.exit(1);
  }
});
