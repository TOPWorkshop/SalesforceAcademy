const fs = require('fs');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');

const log = require('./libraries/log');

const AbstractController = require('./controllers');

module.exports = class App {
  constructor() {
    this.config = config.get('server');

    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
  }

  initServer() {
    this.app = express();
    this.server = http.Server(this.app);

    this.server.on('error', error => App.handleServerError(error));

    log.silly('Server initialized');
  }

  initMiddlewares() {
    this.app.use(morgan(this.config.logFormat, {
      skip: (req, res) => res.statusCode >= 400,
      stream: { write: message => log.server.info(message) },
    }));

    this.app.use(morgan(this.config.logFormat, {
      skip: (req, res) => res.statusCode < 400,
      stream: { write: message => log.server.warn(message) },
    }));

    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    log.silly('Middlewares initialized');
  }

  initRoutes() {
    const controllersDir = path.join(__dirname, 'controllers');

    fs
      .readdirSync(controllersDir)
      .filter(filename => filename !== 'index.js' && filename.substr(-3) === '.js')
      .forEach((filename) => {
        const controllerFile = path.join(controllersDir, filename);
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const Controller = require(controllerFile);

        this.app.use('/api', new Controller().router);
      });

    this.app.use(express.static(path.join(__dirname, '..', 'public')));

    this.app.use(AbstractController.handle404);
    this.app.use(AbstractController.handle500);

    log.silly('Routes initialized');
  }

  static handleServerError(error) {
    log.error('Server error');
    log.debug(error.message);
  }

  async listen() {
    await new Promise((resolve, reject) =>
      this.server.listen(this.config.port, err => (err ? reject(err) : resolve())));
    log.info(`Server listening on port ${this.config.port}`);
  }

  async close() {
    await new Promise((resolve, reject) =>
      this.server.close(err => (err ? reject(err) : resolve())));
  }
};
