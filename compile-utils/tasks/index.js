const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const parentUtils = path.join(ROOT, 'compile-utils');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
const hbs = require('handlebars');

/**
 * This function replaces the content of the files of
 * plugin project with the custom class variables.
 * @function
 */
const replaceContent = (files, name, id) => {
  const hbsVar = {
    archetype: {
      plugin: {
        name,
        id,
      },
    },
  };
  files.forEach((file) => {
    // replaced content
    const newContent = hbs.compile(fs.readFileSync(file, {
      encoding: 'utf-8',
    }))(hbsVar);
    fs.outputFileSync(file, newContent);
  });
}

/**
 * This function renames the files of the project plugin.
 * @function
 */
const rename = (files, name) => {
  const regExp = /archetype([^\\]*\.\w+)$/;
  const newNameRegExp = name + '$1';
  files.forEach((file) => {
    fs.renameSync(file, file.replace(regExp, newNameRegExp));
  });
}

/**
 * Custom console with colors
 * @class
 */
class CustomConsole {
  constructor(options) {
    this.header = chalk.hex('#e7338c').bold(options.header);
  }

  success(msg) {
    console.log(`${this.header} ${chalk.green('[SUCCESS] '+ msg)}`);
  }

  error(msg) {
    console.log(`${this.header} ${chalk.red('[ERROR] '+ msg)}`);
  }

  info(msg) {
    console.log(`${this.header} ${chalk.blue('[INFO] ' + msg)}`);
  }

  warn(msg) {
    console.log(`${this.header} ${chalk.hex('#f2a515')('[WARN] ' + msg)}`);
  }

  clear() {
    console.log('\x1Bc');
  }

  log(msg) {
    console.log(`${msg}`);
  }
}

/**
 * @const
 */
const customConsole = new CustomConsole({ header: '[Mapea-plugins]' })

/**
 * This function install extern node libraries.
 * @function
 */
const npmInstall = async (destDir, progressBar) => {
  const npm = spawn('npm', ['i'], {
    cwd: path.resolve(destDir),
  });

  const arrData = [];

  npm.stdout.on('data', (data) => {
    arrData.push(data);
  });

  npm.stdout.on('close', () => {
    progressBar.stop();
    arrData.push('The project is ready for development. Happy coding!');
    arrData.forEach(data => customConsole.success(data));
  });
};

/**
 * This function read the users's answer to override the folder
 * @function
 */
const overrideAsk = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    const question = chalk.hex('#f2a515')(' [WARN] There is already a plugin project with that name. Do you want to overwrite it? [y/n]:');
    rl.question(customConsole.header + question, (answer) => {
      resolve(answer);
      rl.close();
    });
  })
};

/**
 * This function read the users's answer to install node modules libraries.
 * @function
 */
const askNPMInstall = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    const question = ' Do you want Mapea-plugins install the npm dependencies? [y/n]: ';
    rl.question(customConsole.header + question, (answer) => {
      resolve(answer);
      rl.close();
    });
  })
};

/**
 * This function read the users's answer to override the folder
 * @function
 */
const getPluginName = async () => {
  customConsole.clear();
  customConsole.warn('Plugin name can not be empty or contains spaces.');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    const question = ' What is the name of your plugin?: ';
    rl.question(customConsole.header + question, async (answer) => {
      let finalAnswer = answer;
      if (finalAnswer === '' || finalAnswer.trim() !== finalAnswer || /\s/.test(finalAnswer)) {
        rl.close();
        const finalAnswer = await getPluginName();
        resolve(finalAnswer);
      } else {
        resolve(finalAnswer);
        rl.close();
      }
    });
  })
};

/**
 * Bar object
 * @class
 */
class Bar {
  constructor(msg, time) {
    this.arrBar = new Array(10).fill('.');
    this.msg = msg;
    this.time = time;
    this.currentTime = 0;
  }

  /**
   * @method
   */
  update(percentageParam = null) {
    const percentage = percentageParam || (this.currentTime / this.time) * 100;
    if (percentage % 10 === 0) {
      for (let i = 0; i < percentage / 10; i += 1) {
        this.arrBar[i] = '=';
      }
    }
    this.drawingBar = '[' + this.arrBar.join('') + ']';
    return `${this.msg} ${Math.round(percentage)}% ${this.drawingBar}`;
  }

  /**
   * @method
   */
  start() {
    this.idTimeout = setInterval(() => {
      if (this.currentTime < this.time) {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(chalk.blue(`${this.update()}`));
        this.currentTime += 1;
      }
    }, 1000);
  }

  /**
   * @method
   */
  async stop() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(chalk.blue(`${this.update(100)}\n`));
    clearInterval(this.idTimeout);
  }
}

/**
 * @function
 */
const taskNPMInstall = async (destDir) => {
  const progressBar = new Bar(customConsole.header + ' [INFO] Executing npm install', 20);
  progressBar.start();
  npmInstall(destDir, progressBar).catch(error => {
    customConsole.error(error)
  });
};

/**
 * This function creates the archetype plugin
 * @function
 */
const createArchetype = async (srcDir, destDir, name, files) => {
  fs.copySync(srcDir, destDir);
  replaceContent(files, name, name.toLowerCase());
  rename(files, name.toLowerCase());
  customConsole.success(`${name} project has been created successfully in ${destDir}.`);
  const answerNPMInstall = await askNPMInstall();
  if (answerNPMInstall.toLowerCase() === "y") {
    taskNPMInstall(destDir);
  } else {
    customConsole.success('The project is ready for development. Happy coding!')
  }
}

/**
 * Main functions
 * @function
 */
const main = async () => {
  fs.ensureDirSync(path.join(ROOT, 'plugins'));
  const pluginName = await getPluginName();
  const capitalizeName = pluginName[0].toUpperCase() + pluginName.slice(1);
  const id = pluginName.toLowerCase();
  const srcDir = path.join(parentUtils, 'archetype');
  const destDir = path.join(ROOT, 'plugins', id);

  const FILES = [
    path.join(destDir, 'package.json'),
    path.join(destDir, 'README.md'),
    path.join(destDir, 'LICENSE'),
    path.join(destDir, 'webpack-config', 'webpack.production.config.js'),
    path.join(destDir, 'src', 'facade', 'assets', 'css', 'archetype.css'),
    path.join(destDir, 'src', 'facade', 'js', 'archetype.js'),
    path.join(destDir, 'src', 'facade', 'js', 'archetypecontrol.js'),
    path.join(destDir, 'src', 'impl', 'ol', 'js', 'archetypecontrol.js'),
    path.join(destDir, 'src', 'templates', 'archetype.html'),
    path.join(destDir, 'test', 'test.js'),
    path.join(destDir, 'test', 'dev.html'),
    path.join(destDir, 'test', 'prod.html')
  ];

  const existDir = fs.existsSync(destDir);
  if (existDir === true) {
    const answer = await overrideAsk();
    if (answer.toLowerCase() === 'y') {
      createArchetype(srcDir, destDir, capitalizeName, FILES);
    } else {
      customConsole.info('Aborted task.');
    }
  } else {
    createArchetype(srcDir, destDir, capitalizeName, FILES);
  }
};

main().catch(err => customConsole.error(err));
