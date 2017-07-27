var path = require('path')
var paths = require('../paths')
var webpack = require('webpack')

module.exports = {
  entry: {
      index: paths.lambdaIndex
  },
  output: {
    path: paths.dist,
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader', 
        query: {
          presets: ['es2015', 'react'],
          plugins: ['transform-es2015-destructuring', 'transform-object-rest-spread'],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader',
        options: {
            name: '[path][name].[hash].[ext]',
        },
      },
      {
        test: /.json$/,
        loader: 'json-loader'
      }
    ]
  }
}