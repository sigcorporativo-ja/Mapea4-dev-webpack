const webpack = require('webpack');
const console = require('../../../util/console');
const config = require('./webpack.config');
const Util = require('../../../util/util');
const events = require('events');
module.exports = class WebpackCompiler {
  constructor(names) {
    this.names_ = names;
  }

  genConfigs() {
    return this.names_.map(name => Util.genWebpackConfig(name, config));
  }

  compiler() {
    let configs = this.genConfigs();
    let multiCompiler = webpack(configs);
    let noCompileErrors = true;
    multiCompiler.compilers.forEach(compiler => {
      let emmiter = new events();
      emmiter.on('warn', (warnings) => {
        warnings.forEach(warn => console.warn(warnings));
        console.warn('Plugins compiled with warnings ');
        console.info('Execute `npm runtest-build` for testing generated build.');
      });
      emmiter.on('error', (errors) => {
        errors.forEach(error => console.error(error));
        console.error('Error compiling plugins');
        let error = new Error("");
        error.stack = "";
        throw error;
      });
      compiler.plugin('compilation', (compilation) => {
        compilation.plugin('succeed-module', (mod) => {
          let errors = mod['errors'];
          let warnings = mod['warnings'];
          if (warnings.length > 0) {
            emmiter.emit('warn', warnings);
            noCompileErrors = false;
          }
          if (errors.length > 0) {
            emmiter.emit('error', errors);
          }
        });
      });
      compiler.run((err, stats) => {
        if (err) {
          throw err;
        }
        else {
          if (noCompileErrors) {
            console.success('Plugins compiled successfully');
            console.info('Execute `npm run test-build` for testing generated build.');
          }
        }
      });
    });
  }
};
