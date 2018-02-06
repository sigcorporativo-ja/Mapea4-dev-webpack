#!/usr/bin / env node

'use strict';

const path = require('path');
const ROOT = path.join(__dirname, '../../..');
const parentUtils = path.join(__dirname, '../..');
const console = require(path.resolve(parentUtils, 'util/console'))
const fs = require('fs-extra');
const colors = require('colors/safe');
const os = require('os');
const httpServer = require('./lib/http-server');
const portfinder = require('portfinder');
const opener = require('opener');
const argv = require('optimist').boolean('cors').argv;

let ifaces = os.networkInterfaces();

let port = argv.p || parseInt(process.env.PORT, 10);
let host = argv.a || '0.0.0.0';
let ssl = !!argv.S || !!argv.ssl;
let proxy = argv.P || argv.proxy;
let utc = argv.U || argv.utc;
let logger;

if (!argv.s && !argv.silent) {
  logger = {
    info: console.info,
    request: function(req, res, error) {
      let date = utc ? new Date().toUTCString() : new Date();
      if (error) {
        logger.info(
          '[%s] "%s %s" Error (%s): "%s"',
          date, colors.red(req.method), colors.red(req.url),
          colors.red(error.status.toString()), colors.red(error.message)
        );
      }
      else {
        logger.info(
          '[%s] "%s %s" "%s"',
          date, colors.cyan(req.method), colors.cyan(req.url),
          req.headers['user-agent']
        );
      }
    }
  };
}
else if (colors) {
  logger = {
    info: function() {},
    request: function() {}
  };
}

if (!port) {
  portfinder.basePort = 8080;
  portfinder.getPort(function(err, port) {
    if (err) {
      throw err;
    }
    listen(port);
  });
}
else {
  listen(port);
}

function listen(port) {
  let options = {
    root: ROOT,
    cache: argv.c,
    showDir: argv.d,
    autoIndex: argv.i,
    gzip: argv.g || argv.gzip,
    robots: argv.r || argv.robots,
    ext: argv.e || argv.ext,
    logFn: logger.request,
    proxy: proxy,
    showDotfiles: argv.dotfiles
  };

  if (argv.cors) {
    options.cors = true;
    if (typeof argv.cors === 'string') {
      options.corsHeaders = argv.cors;
    }
  }

  if (ssl) {
    options.https = {
      cert: argv.C || argv.cert || 'cert.pem',
      key: argv.K || argv.key || 'key.pem'
    };
  }

  let server = httpServer.createServer(options);
  server.listen(port, host, function() {
    let canonicalHost = host === '0.0.0.0' ? '127.0.0.1' : host,
      protocol = ssl ? 'https://' : 'http://';

    logger.info([colors.yellow('Starting up http-server, serving '),
        colors.cyan(server.root),
        ssl ? (colors.yellow(' through') + colors.cyan(' https')) : '',

      ].join(''));

    logger.info(colors.yellow('Available on:'));
    if (argv.a && host !== '0.0.0.0') {
      logger.info(('  ' + protocol + canonicalHost + ':' + colors.green(port.toString())));
    }
    else {
      Object.keys(ifaces).forEach(function(dev) {
        ifaces[dev].forEach(function(details) {
          if (details.family === 'IPv4') {
            logger.info(('  ' + protocol + details.address + ':' + colors.green(port.toString())));
          }
        });
      });
    }

    if (typeof proxy === 'string') {
      logger.info('Unhandled requests will be served from: ' + proxy);
    }

    logger.info('Hit CTRL-C to stop the server');
    if (argv.o) {
      opener(
        protocol + canonicalHost + ':' + port, {
          command: argv.o !== true ? argv.o : null
        }
      );
    }
  });
}

if (process.platform === 'win32') {
  require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  }).on('SIGINT', function() {
    process.emit('SIGINT');
  });
}

process.on('SIGINT', function() {
  logger.info(colors.red('http-server stopped.'));
  process.exit();
});

process.on('SIGTERM', function() {
  logger.info(colors.red('http-server stopped.'));
  process.exit();
});
