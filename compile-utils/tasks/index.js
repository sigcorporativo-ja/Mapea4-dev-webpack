const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const parentUtils = path.join(ROOT, 'compile-utils');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const readline = require('readline');
const chalk = require('chalk');
const hbs = require('handlebars');

/** 
 * Final message
 * @const
 */
const FINAL_MSG = 'The project is ready for development. Happy coding!';

/** 
 * Header output messages 
 * @const 
 */
const HEADER = '[Mapea-plugins]';

/** 
 * npm install question
 * @const
 */
const ASK_NPM_INSTALL = ' Do you want Mapea-plugins install the npm dependencies? [y/n]: ';

/** 
 * Plugin name question
 * @const
 */
const ASK_PLUGIN_NAME = ' What is the of your plugin?: ';

/** 
 * Override plugin question
 * @const
 */
const OVERRIDE_ASK = '[WARN] There is already a plugin project with that name. Do you want to overwrite it? [y/n]:';

/** 
 * Name plugin warning
 * @const
 */
const WARN_PLUGIN_NAME = 'Plugin name cannot be empty or contains spaces.';

/** 
 * Success message of archetype creation.
 * @function
 */
const successMsg = (name, destDir) => `${name} project has been created successfully in ${destDir}.`;
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
 * Instance of custom console class
 * @const
 */
const customConsole = new CustomConsole({
  header: HEADER,
});

/**
 * This function install extern node libraries.
 * @function
 * @async
 */
const npmInstall = async (destDir, progressBar) => {
  let npm = null;
  if (!/^win/.test(process.platform)) { // linux
    npm = spawn('npm', ['i'], {
      cwd: path.resolve(destDir),
      stdio: 'inherit',
    });
  } else { // windows
    npm = spawn('cmd', ['/s', '/c', 'npm', 'i'], {
      cwd: path.resolve(destDir),
      stdio: 'inherit',
    });
  }

  return npm;
};

/**
 * This function read the users's answer to override the folder
 * @function
 * @async 
 */
const overrideAsk = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    const question = chalk.hex('#f2a515')(OVERRIDE_ASK);
    rl.question(customConsole.header + question, (answer) => {
      resolve(answer);
      rl.close();
    });
  })
};

/**
 * This function read the users's answer to install node modules libraries.
 * @function
 * @async 
 */
const askNPMInstall = async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(customConsole.header + ASK_NPM_INSTALL, (answer) => {
      resolve(answer);
      rl.close();
    });
  })
};

/**
 * This function read the users's answer to override the folder
 * @function
 * @async
 */
const getPluginName = async () => {
  customConsole.clear();
  customConsole.warn(WARN_PLUGIN_NAME);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    const question = ASK_PLUGIN_NAME;
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
 * Resolve the npm install task
 * @function
 * @async
 */
const taskNPMInstall = async (destDir) => {
  npmInstall(destDir).then((npmProcess) => {
    npmProcess.on('close', () => customConsole.success(FINAL_MSG));
  }).catch(error => {
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
  customConsole.success(successMsg(name, destDir));
  const answerNPMInstall = await askNPMInstall();
  if (answerNPMInstall.toLowerCase() === "y") {
    taskNPMInstall(destDir);
  } else {
    customConsole.success(FINAL_MSG);
  }
}

/**
 * Main task
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
    path.join(destDir, 'src', 'api.json'),
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

/**
 * Run the program
 */
main().catch(err => customConsole.error(err));
