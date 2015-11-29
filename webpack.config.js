var webpack = require('webpack');

module.exports = {
  entry: './app/index',
  output: {
    path: __dirname + '/build/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ],  
  module: {
    loaders: [
      { test: /\.tag$/, loader: 'tag' }
    ]
  }
};