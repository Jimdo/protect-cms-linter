'use strict';

var glob = require('glob');
var path = require('path');

module.exports = function getFixtures(dir) {
  var baseDir = path.join(process.cwd(), 'test/fixtures', dir);

  return glob.sync(
    '**/*.css',
    {cwd: baseDir}
  ).map((file) => {
    var name = file
      .replace('.css', '')
      .replace(/\+/g, ' with ')
      .replace(/\-/g, ' ');

    return {
      name,
      fileName: file,
      fullPath: path.join(baseDir, file)
    };
  });
};
