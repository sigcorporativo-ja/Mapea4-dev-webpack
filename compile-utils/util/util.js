const fs = require('fs-extra');
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const hbs = require('handlebars');

module.exports = class Util {

  // Filter the name of plugins that exist in src/*
  static filterExistPlugins(names) {
    var plugins = fs.readdirSync(path.resolve(ROOT, './plugins'));
    names = names.map(name => name.toLowerCase());
    return names.filter(name => plugins.includes(name));
  }

  // Generates a webpackConfig from a plugin name
  static genWebpackConfig(name, config) {
    try {
      return Object.assign({}, config, {
        entry: config.entry(name),
        output: {
          path: config.output.path(name),
          filename: config.output.filename(name)
        },
        plugins: config.plugins.map(plugin => typeof plugin == 'function' ? plugin(name) : plugin),
        resolve: {
          modules: config.resolve.modules,
          extensions: config.resolve.extensions,
          alias: config.resolve.alias(name)
        }
      });
    }
    catch (ex) {
      console.error('An error occurred while generating the configuration.')
      console.error(ex);
    }
  }

  static replaceContent(files, name, id) {
    var hbsVar = {
      'archetype': {
        'plugin': {
          'name': name,
          'id': id
        }
      }
    };
    files.forEach(function(file) {
      // replaced content
      var newContent = hbs.compile(fs.readFileSync(file, {
        encoding: 'utf-8'
      }))(hbsVar);
      fs.outputFileSync(file, newContent);
    });
  }

  static rename(files, name) {
    var regExp = /archetype([^\\]*\.\w+)$/;
    var newNameRegExp = name + '$1';
    files.forEach(function(file) {
      fs.renameSync(file, file.replace(regExp, newNameRegExp));
    });
  }

  static renameTpl(files, name) {
    var regExp = /(.*)\.tpl\.(html)/;
    var newNameRegExp = '$1' + "." + '$2';
    files.forEach(function(file) {
      fs.renameSync(file, file.replace(regExp, newNameRegExp));
    });
  }
};
