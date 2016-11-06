var webpack = require('webpack')

var commonConfig = require('./webpack.common.config.js');

commonConfig.debug = false;
commonConfig.plugins.push(
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(false),
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.DedupePlugin()
);
module.exports = commonConfig;
