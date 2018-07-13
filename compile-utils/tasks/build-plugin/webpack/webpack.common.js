const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompileTemplatesPlugin = require("./webpack-plugins/compile-templates-plugin");
const ROOT = path.resolve(__dirname, '../../../..');
module.exports.buildPath = path.resolve(ROOT, 'build');
module.exports.srcPath = path.resolve(ROOT, 'plugins');
module.exports.devPath = path.resolve(ROOT, 'dist');

module.exports.loaders = [
  {
    test: /(\.jsx|\.js)$/,
    loader: 'babel-loader',
    exclude: /(node_modules|bower_components)/,
    query: {
      cacheDirectory: true,
      plugins: ['transform-decorators-legacy'],
      presets: ['es2015']
    }
  }, {
    test: /(\.jsx|\.js)$/,
    loader: 'eslint-loader',
    exclude: /node_modules/
}, {
    test: /\.(html)$/,
    loader: 'html-loader',
    exclude: /node_modules/
}, {
    test: /\.(woff|woff2|eot|ttf|svg)$/,
    exclude: /node_modules/,
    loader: 'url-loader?limit=1024&name=fonts/[name].[ext]'
}];

module.exports.plugins = [(pName) => new CompileTemplatesPlugin({
  src: path.resolve(ROOT, `plugins/${pName}/src/templates`),
  name: `${pName}`
})];

//TODO webpack.optimize.CommonChunksPlugin

module.exports.resolve = {
  modules: [path.resolve('./node_modules'), path.resolve('./src')],
  extensions: ['.json', '.js'],
  alias: (pName) => {
    return {
      'assets': path.resolve(ROOT, `plugins/${pName}/src/facade/assets`),
      'impl': path.resolve(ROOT, `plugins/${pName}/src/impl/ol/js`),
      'templates': path.resolve(ROOT, `plugins/${pName}/src/templates`),
      'test': path.resolve(ROOT, `plugins/${pName}/src/test`),
      'util': path.resolve(__dirname, '../../../util')
    };
  }
};
