import { BaseModule } from '@modern-mean/server-base-module';
import config from './config';
import logger from './logger';
import mongoose from 'mongoose';



export class MongooseModule extends BaseModule {

  constructor(...args) {
    //Push default configuration to front of array.  Passed in configuration from ...args should take precedence.
    args.unshift({ config: config(), logger: logger() });
    super(...args);

    this.config = this.getConfigModule().get();
    this.logger = this.getLoggerModule().get();

    // Use native promises
    mongoose.Promise = global.Promise;

    if (this.config.debug !== 'false') {
      this.logger.error('Mongoose::Debug::Enabled');
      mongoose.set('debug', true);
    }

  }

  get() {
    return mongoose;
  }

  connect() {
    return new Promise((resolve, reject) => {

      if (mongoose.connection.readyState !== 0) {
        this.logger.debug('MongooseModule::Connect::Already Connected');
        return resolve('Already Connected');
      }
      this.logger.debug('MongooseModule::Connect::Starting', this.config.uri);
      mongoose.connect(this.config.uri, this.config.options);

      mongoose.connection.once('error', err => {
        this.logger.error('Mongoose::Error', err);
        return reject(err);
      });

      mongoose.connection.once('open', () => {
        this.logger.debug('Mongoose::Connect::Success');
        return resolve();
      });

    });
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      this.logger.debug('Mongoose::Disconnect::Start');
      if (mongoose.connection.readyState === 0) {
        this.logger.debug('Mongoose::Disconnect::Not Connected');
        return resolve('Not Connected');
      }

      mongoose.connection.once('disconnected', () => {
        this.logger.debug('Mongoose::Disconnect::Success');
        return resolve();
      });

      mongoose.disconnect();
    });
  }

}
