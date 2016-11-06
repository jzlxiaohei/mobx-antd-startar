var path = require('path');
var fs = require('fs');
var express = require('express');
var webpack = require('webpack');
var chokidar = require('chokidar');
var config = require('./webpack/webpack.development.config');
var _ = require('lodash');
var app = express();
var compiler = webpack(config);
var colors = require('colors');


app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require('webpack-hot-middleware')(compiler));


// serve static files
app.use(function (req, res, next) {
  if (_.startsWith(req.path, '/static/')) {
    return res.sendFile(path.join(__dirname, req.path))
  }
  return next()
});


app.get('*', function (req, res, next) {
  const reqPath = req.path;
  if (isMockHttpPath(reqPath)) {
    return next();
  }
  res.sendFile(path.join(__dirname, '/src/index.html'))
});

const mock_server_dir = path.join(__dirname, './mock_server');
const mock_server_path = path.join(mock_server_dir, 'index.js');

const mockFolderReg = /mock_server/;

function isMockHttpPath(httpPath) {
  return _.startsWith(httpPath, '/api');
}

chokidar.watch(mock_server_path).on('all', (event, path) => {
  //remove require cache first
  Object.keys(require.cache).forEach(function (module) {
    if (mockFolderReg.test(require.cache[module].filename)) {
      delete require.cache[module];
    }
  });
  // clear express router to rebuild router
  var routes = app._router.stack;
  app._router.stack = routes.filter(function (layer, i) {
    if (layer && layer.route) {
      return !isMockHttpPath(layer.route.path)
    }
    return true
  });
  require(mock_server_path)(app);
  console.log('mock server api reloaded!!!'.green)
});

process.on("unhandledRejection", (err, p) => {
  console.error(err); // print the error
  console.error(err.stack)
});

var devPort = 9527;
app.listen(devPort, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + devPort);
});

