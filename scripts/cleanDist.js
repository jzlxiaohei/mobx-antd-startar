var path = require('path');

var fsExtra = require('fs-extra');
var glob = require('glob-all');
var distBaseDir = path.join(__dirname, '../dist');

glob.sync(path.join(distBaseDir, '**/*'))
  .forEach(function (file) {
    fsExtra.removeSync(file)
  });
