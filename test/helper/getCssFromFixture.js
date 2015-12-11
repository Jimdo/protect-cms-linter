'use strict';

var fs = require('fs');

module.exports = function getCssFromFixture(fixture) {
  return new Promise((resolve, reject) => {
    fs.readFile(fixture.fullPath, 'utf-8', (err, content) => {
      if (err) {
        return reject(err);
      }
      resolve(content);
    });
  });
};
