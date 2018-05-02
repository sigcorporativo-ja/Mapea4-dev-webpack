const path = require('path');
const ROOT = path.join(__dirname, '../../..');
const parentUtils = path.join(__dirname, '../..');
const fs = require('fs-extra');
const params = require('minimist')(process.argv.slice(2));
const Util = require(path.resolve(parentUtils, 'util/util'));
const console = require(path.resolve(parentUtils, 'util/console'));

if (params.name != null) {
  if (params.name.trim() == "") {
    console.error("Plugin name is not defined.");
    console.warn("There are extra spaces.");
    console.info("Use: npm run create-plugin -- --name=<name-of-plugin>");
  }
  else {

    let name = params.name.trim();
    let id = name.toLowerCase();

    // copy archetype
    let srcDir = path.join(parentUtils, 'archetype');
    let destDir = path.join(ROOT, 'plugins', name.toLowerCase());

    fs.ensureDirSync(destDir);
    fs.copySync(srcDir, destDir);
    let files = [
    // facade/assets/css/archetype.css
    path.join(destDir, 'src', 'facade', 'assets', 'css', 'archetype.css'),
    // facade/js/archetype.js
    path.join(destDir, 'src', 'facade', 'js', 'archetype.js'),
    // facade/js/archetypeControl.js
    path.join(destDir, 'src', 'facade', 'js', 'archetypecontrol.js'),
    // impl/ol/js/archetypeControl.js
    path.join(destDir, 'src', 'impl', 'ol', 'js', 'archetypecontrol.js'),
    // templates/archetype.html
    path.join(destDir, 'src', 'templates', 'archetype.html')];
    let tests = [
    // test/test.tpl.html
    path.join(destDir, 'test', 'dev.tpl.html'),
    // test/test.prod.tpl.html
    path.join(destDir, 'test', 'prod.tpl.html')];

    Util.replaceContent(files, name, name.toLowerCase());
    Util.rename(files, name.toLowerCase());
    Util.replaceContent(tests, name, name.toLowerCase());
    Util.renameTpl(tests);
    console.success('Archetype plugin has been created successfully!');
  }
}
else {
  console.error("Plugin name is not defined.");
  console.info("Use: npm run create-plugin -- --name=<name-of-plugin>");
}
