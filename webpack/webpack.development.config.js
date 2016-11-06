var _ = require('lodash')
var webpack = require('webpack')
var commonConfig = require('./webpack.common.config.js');

var devServerConfig = _.cloneDeep(commonConfig);

devServerConfig.debug = true;
devServerConfig.cache = true;
devServerConfig.devtool='#eval-source-map';


for(var i in devServerConfig.entry){
  var originFile = devServerConfig.entry[i];
  devServerConfig.entry[i] = ['react-hot-loader/patch','webpack-hot-middleware/client?reload=false', originFile]
}


devServerConfig.plugins = [
  new webpack.DefinePlugin({
    __DEV__: JSON.stringify(true)
  }),
  // Webpack 1.0
  new webpack.optimize.OccurenceOrderPlugin(),
  // Webpack 2.0 fixed this mispelling
  // new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]

module.exports = devServerConfig;