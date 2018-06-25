'use strict'

var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob_entries = require('webpack-glob-entries');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');

function getReactComponentPaths() {
  var componentsObj = glob_entries('src/templates/**/*-reactcomponent/');

  Object.keys(componentsObj).forEach(key => {
    var newKey = key.replace('-reactcomponent', '');

    componentsObj[newKey] =  path.join(__dirname, componentsObj[key]);
    delete componentsObj[key];
  });

  console.log('COMPONENTS OBJ: ', componentsObj);
  return componentsObj
}

module.exports = {
  mode: 'development',
  watch: true,
  entry: Object.assign({}, getReactComponentPaths()),
  output: {
    publicPath: "/html/",
    path: path.join(__dirname, "/html/assets/bundles"),
    filename: "[name]-bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          }, {
            loader: "css-loader"
          }
        ]
      },
      {
        test: /\.jsx?/,
        exclude: /(node_modules)/,
        loaders: ['babel?presets[]=react,presets[]=es2015', 'webpack-module-hot-accept'],
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
};
