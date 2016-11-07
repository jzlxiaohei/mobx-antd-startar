var webpack = require('webpack');
var path = require('path');
var basePath = path.join(__dirname, '..');
var bourbon = require('node-bourbon').includePaths;
var moment = require('moment');

var isProduction = process.env.NODE_ENV === 'production';

var output_filename = '[name].js';

if (isProduction) {
  var child_process = require('child_process');
  var commit = child_process.execSync('git rev-parse --short HEAD')
    .toString()
    .split(/[\r\n]+/g)[0];
  var dateStr = moment().format('YYYYMMDD');

  output_filename = '[name]-' + dateStr + '-' + commit + '.js';

  const assetsReplaceMap = {
    '/static/react-dom-router-addons.js': '/static/react-dom-router-addons.min.js',  // use min for production
    '/static/antd.min.js': '/static/antd.min.js',
    '/static/antd.min.css': '/static/antd.min.css',
    '/assets/main.js': output_filename.replace('[name]','main')
  };
  require('../scripts/processHtml')(assetsReplaceMap);
}

module.exports = {
  entry: {
    main: path.join(__dirname, '../src/main.js')
  },
  output: {
    filename: output_filename, // in dev mode, filename will be [name].js
    path: path.join(basePath, 'dist/assets'),
    publicPath: '/assets/',
    libraryTarget: 'umd'
  },

  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        include: path.join(__dirname, '../src'),
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader?cacheDirectory=true'
      },
      {
        test: /\.scss/,
        loader: 'style-loader!css-loader!sass-loader?includePaths[]=' + path.resolve(__dirname, '../src/styles') + '&includePaths[]=' + bourbon + '&outputStyle=expanded'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(png|jpe?g|woff|woff2|svg|eot|ttf)$/,
        loader: 'url-loader'
      },
      {
        test: /\.json&/,
        loader: "json"
      }
    ]
  },
  externals: {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
    'react-addons-css-transition-group': {
      root: [
        'React',
        'addons',
        'CSSTransitionGroup'
      ],
      commonjs: 'react-addons-css-transition-group',
      commonjs2: 'react-addons-css-transition-group',
      amd: 'react-addons-css-transition-group'
    },
    'react-router': {
      root: 'ReactRouter',
      commonjs: 'react-router',
      commonjs2: 'react-router',
      amd: 'react-router',
    },
    antd: {
      root: 'antd',
      commonjs: 'antd',
      commonjs2: 'antd',
      amd: 'antd',
    }
  },
  resolve: {
    extensions: [
      '',
      '.js',
      '.jsx',
      '.scss',
      '.css'
    ],
    alias: {
      'js/config': basePath + '/src/config/' + (process.env.FE_ENV || "development"),
      'js/pages': basePath + '/src/pages',
      'js/models': basePath + '/src/models',
      'js/utils': basePath + '/src/utils',
      'js/infra': basePath + '/src/infrastructure',
      'js/components': basePath + '/src/components',
    },
    modulesDirectories: ['node_modules']
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],

  cache: true,
  devtool: false,

  stats: {
    colors: true,
    reasons: true
  }
};
