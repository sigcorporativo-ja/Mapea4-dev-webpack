const console = require('../../util/console');
const Util = require('../../util/util');
const params = require('minimist')(process.argv.slice(2));
const WebpackCompiler = require('./webpack/webpack-compiler');
const fs = require('fs-extra');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../..');

// main program build
let plugins;
if (params.names == null || params.names == '*') {
  let folderPlugins = path.resolve(ROOT, 'plugins');
  fs.ensureDirSync(folderPlugins);
  plugins = fs.readdirSync(folderPlugins);
}
else {
  let names = params.names.split(",");
  plugins = Util.filterExistPlugins(names);
}

if (plugins.length !== 0) {
  (new WebpackCompiler(plugins)).compiler();
}
else {
  console.info('There is no plugins to compile.');
}
