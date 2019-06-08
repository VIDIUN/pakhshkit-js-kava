'use strict';

const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const PROD = process.env.NODE_ENV === 'production';
const packageData = require('./package.json');

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name)
  })
];

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
} else {
  plugins.push(
    new CopyWebpackPlugin([
      {
        from: '',
        to: '.'
      }
    ])
  );
}

module.exports = {
  context: __dirname + '/src',
  entry: {
    'pakhshkit-kava': 'index.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: ['VidiunPlayer', 'plugins', 'kava'],
    libraryTarget: 'umd',
    devtoolModuleFilenameTemplate: './kava/[resource-path]'
  },
  devtool: 'source-map',
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              rules: {
                semi: 0
              }
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: __dirname + '/src'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  externals: {
    'pakhshkit-js': {
      commonjs: 'pakhshkit-js',
      commonjs2: 'pakhshkit-js',
      amd: 'pakhshkit-js',
      root: ['VidiunPlayer', 'core']
    },
    'pakhshkit-js-providers': {
      commonjs: 'pakhshkit-js-providers',
      commonjs2: 'pakhshkit-js-providers',
      amd: 'pakhshkit-js-providers',
      root: ['VidiunPlayer', 'providers']
    }
  }
};
