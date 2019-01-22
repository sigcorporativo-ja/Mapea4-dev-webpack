const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const common = require('./webpack.common');

module.exports = {};

module.exports.entry = (pName) => `${common.srcPath}/${pName}/src/facade/js/${pName}.js`;
module.exports.devtool = 'source-map';
module.exports.output = {
  path: (pName) => `${common.buildPath}/${pName}`,
  filename: (pName) => `${pName}.ol.min.js`,
  libraryTarget: 'window'
};

module.exports.module = {
  rules: common.loaders.concat([{
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            url: false,
            minimize: true,
            sourceMap: true
          }
        }]
    })
  }])
};

module.exports.plugins = common.plugins.concat([new webpack.optimize.UglifyJsPlugin({
    ecma: 6,
    mangle: false //problemas en los plugins IDEA    
  }),
  (pName) => new ExtractTextPlugin(`${pName}.min.css`),
]);

module.exports.resolve = common.resolve;
