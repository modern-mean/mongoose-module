'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MongooseModule = undefined;

var _serverBaseModule = require('@modern-mean/server-base-module');

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MongooseModule extends _serverBaseModule.BaseModule {

  constructor(...args) {
    //Push default configuration to front of array.  Passed in configuration from ...args should take precedence.
    args.unshift({ config: (0, _config2.default)(), logger: (0, _logger2.default)() });
    super(...args);

    this.config = this.getConfigModule().get();
    this.logger = this.getLoggerModule().get();

    // Use native promises
    _mongoose2.default.Promise = global.Promise;

    if (this.config.debug !== 'false') {
      this.logger.error('Mongoose::Debug::Enabled');
      _mongoose2.default.set('debug', true);
    }
  }

  get() {
    return _mongoose2.default;
  }

  connect() {
    return new Promise((resolve, reject) => {

      if (_mongoose2.default.connection.readyState !== 0) {
        this.logger.debug('MongooseModule::Connect::Already Connected');
        return resolve('Already Connected');
      }
      this.logger.debug('MongooseModule::Connect::Starting', this.config.uri);
      _mongoose2.default.connect(this.config.uri, this.config.options);

      _mongoose2.default.connection.once('error', err => {
        this.logger.error('Mongoose::Error', err);
        return reject(err);
      });

      _mongoose2.default.connection.once('open', () => {
        this.logger.debug('Mongoose::Connect::Success');
        return resolve();
      });
    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.logger.debug('Mongoose::Disconnect::Start');
      if (_mongoose2.default.connection.readyState === 0) {
        this.logger.debug('Mongoose::Disconnect::Not Connected');
        return resolve('Not Connected');
      }

      _mongoose2.default.connection.once('disconnected', () => {
        this.logger.debug('Mongoose::Disconnect::Success');
        return resolve();
      });

      _mongoose2.default.disconnect();
    });
  }

}
exports.MongooseModule = MongooseModule;