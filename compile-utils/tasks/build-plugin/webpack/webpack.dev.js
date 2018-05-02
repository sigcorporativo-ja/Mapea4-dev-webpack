const path = require('path');
const common = require('./webpack.common');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ROOT = path.resolve(__dirname, '../../../..');

module.exports = {};

module.exports.entry = (pName) => `${common.srcPath}/${pName}/src/facade/js/${pName}.js`;
module.exports.devtool = 'source-map';
module.exports.output = {
  path: (pName) => `${common.devPath}/${pName}`,
  filename: (pName) => `${pName}.ol.js`,
  publicPath: '/',
  libraryTarget: 'umd',
  umdNamedDefine: true
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
            minimize: false,
            sourceMap: true
          }
        }]
    })
  }])
};

module.exports.plugins = common.plugins.concat([
  (pName) => new ExtractTextPlugin(`${pName}.css`),
  new webpack.HotModuleReplacementPlugin(),
  (pName) => new HtmlWebpackPlugin({
    template: path.resolve(ROOT, `plugins/${pName}/test/dev.html`),
  }),
]);

module.exports.devServer = {
  // contentBase: path.join(__dirname, "../dist"),
  compress: true,
  port: 8000,
  publicPath: `/`,
};

module.exports.resolve = common.resolve;
