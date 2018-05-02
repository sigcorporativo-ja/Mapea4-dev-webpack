const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const ConcatSource = require("webpack-sources").ConcatSource;

module.exports = class CompileTemplatesPlugin {

  /**
   * @classdesc
   * This class is a webpack plugin that is responsible for compiling and
   * adding the created templates to Mapea core.
   *
   * @constructor
   * @param {Object} options - Options plugin {src:<src-templates>, name:<name-of-plugin>}
   */
  constructor(options) {
    this.options_ = options;
  }

  /**
   * This function apply the options plugin to webpack compiler
   *
   * @public
   * @function
   * @param {WebpackCompiler} compiler - webpack compiler
   * @api stable
   */
  apply(compiler) {
    let options = this.options_;
    let templatesToConcat = this.templatesToCode();
    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('optimize-chunk-assets', (chunks, done) => {
        this.appendCode(compilation, chunks, templatesToConcat);
        done();
      });
    });
  }

  /**
   * This function compiler with Handlebars the templates of src options plugin
   *
   * @public
   * @function
   * @return {Array<Object>} tplCallbacks - Object array of {name:<name-of-template, func: callback of Handlebars}
   * @api stable
   */
  compileTemplates() {
    let tplCallbacks = fs.readdirSync(this.options_.src)
      .filter(template => fs.lstatSync(path.join(this.options_.src, template)).isFile())
      .map(template => {
        let pathFile = path.resolve(this.options_.src, template);
        let file = fs.readFileSync(pathFile, {
          encoding: 'utf-8'
        });
        return {
          'name': template,
          'func': hbs.precompile(file)
        };
      });
    return tplCallbacks;
  }


  /**
   * This function maps tplCallbacks objects to javascript string code.
   *
   * @public
   * @function
   * @return {Array<String>} templatesToCode - string code array which add the templates to mapea core
   * @api stable
   */
  templatesToCode() {
    let tplCallbacks = this.compileTemplates();
    let templatesToCode = tplCallbacks
      .map(tplCallback => `M.template.add("${tplCallback['name']}", Handlebars.template(${tplCallback['func']}))`);
    return templatesToCode;
  }

  /**
   * This function appendCode to every file whose name is the name options
   *
   * @public
   * @function
   * @api stable
   */
  appendCode(compilation, chunks, templates) {
    chunks.forEach(chunk => {
      let regexp = new RegExp(new RegExp(`${this.options_.name}.*\\.js`));
      let fileName = chunk.files
        .find(fileName => regexp.test(fileName));
      if (fileName != null) {
        this.wrapFile(compilation, fileName, templates);
      }
    });
  }

  /**
   * This function adds code template to file whose name is fileName
   *
   * @public
   * @function
   * @api stable
   */
  wrapFile(compilation, fileName, templates) {
    let templatesCode = templates.reduce((cur, next) => `${next};${cur}`) + ";";
    compilation.assets[fileName] = new ConcatSource(
      compilation.assets[fileName],
      templatesCode
    );
  };

};
