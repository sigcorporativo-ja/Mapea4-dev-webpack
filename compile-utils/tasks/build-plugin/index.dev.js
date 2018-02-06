const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const params = require('minimist')(process.argv.slice(2));
const fs = require('fs-extra');
const path = require('path');
const ROOT = path.resolve(__dirname, '../../');
const console = require('../../util/console');
const Util = require('../../util/util');

let config = require('./webpack/webpack.config');

// main program dev
if (params.name == null || typeof params.name != 'string') {
  console.error('Plugin name not defined.');
  console.info('Use: npm run start -- --name=<name-of-plugin>');
} else {
  let plugins = Util.filterExistPlugins([params.name]).map(name => name.toLowerCase());
  let name = plugins[0];
  if (plugins.length === 0) {
    console.error(`plugins/${name} folder not found`);
  } else {
    config = Util.genWebpackConfig(name, config);
    let compiler = webpack(config);
    new webpackDevServer(compiler, config.devServer)
      .listen('8000', 'localhost', (err) => {
        if (err) {
          console.error(err);
        }
      });
    let initialCompilation = true;
    compiler.plugin('done', () => {
      if (initialCompilation) {
        setTimeout(() => {
          console.info('✓ The bundle is now ready for serving!\n');
          console.info(' Open in iframe mode:\t\x1b[33mhttp://' + 'localhost' + ':' + '8000' + '/webpack-dev-server/\x1b[0m');
          console.info(' Open in inline mode:\t\x1b[33mhttp://' + 'localhost' + ':' + '8000' + '/\x1b[0m\n');
          console.info(' \x1b[33mHMR is active\x1b[0m. The bundle will automatically rebuild and live-update on changes.')
        }, 750);
      }
      initialCompilation = false;
    });
  }
}
