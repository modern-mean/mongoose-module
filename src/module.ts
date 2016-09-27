import { BaseModule, ModuleConfig, LoggerOptions } from '@modern-mean/server-base-module';
import * as mongoose from 'mongoose';

export class MongooseModule extends BaseModule {

  private config: ModuleConfig;

  constructor(...args) {

    super(MongooseLoggerConfig(), ...args);

    //Set Config
    this.config = this.configModule.getModule('MongooseModule') || this.configModule.defaults(MongooseDefaultConfig());

    //Set Debug
    mongoose.set('debug', this.config.options.debug);

    this.logger.debug('MongooseModule::Constructor::Finished');
  }

  getMongoose(): mongoose.Mongoose {
    return mongoose;
  }

  connect(): Promise<string> {
    return new Promise((resolve, reject) => {

      if (mongoose.connection.readyState !== 0) {
        this.logger.debug('MongooseModule::Connect::Already Connected');
        return resolve('Already Connected');
      }

      this.logger.debug('MongooseModule::Connect::Starting', this.config.options.uri);
      mongoose.connect(this.config.options.uri, this.config.options.options);

      /* istanbul ignore next */
      mongoose.connection.once('error', err => { //Can't mock the process emit error
        this.logger.error('Mongoose::Error', err);
        return reject(err);
      });

      mongoose.connection.once('open', () => {
        this.logger.debug('Mongoose::Connect::Success');
        return resolve('Connected');
      });

    });
  }

  disconnect(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.logger.debug('Mongoose::Disconnect::Start');

      if (mongoose.connection.readyState === 0) {
        this.logger.debug('Mongoose::Disconnect::Not Connected');
        return resolve('Not Connected');
      }

      mongoose.connection.once('disconnected', () => {
        this.logger.debug('Mongoose::Disconnect::Success');
        return resolve('Disconnected');
      });

      mongoose.disconnect();
    });
  }

}

export interface MongooseOptions {
  uri: string,
  options: any,
  debug: boolean
}

export function MongooseDefaultConfig(): ModuleConfig {
  let options: MongooseOptions = {
    uri: process.env.MONGOOSEMODULE_URI || 'mongodb://localhost/modern-mean-dev',
    options: {
      //http://mongoosejs.com/docs/connections.html
      user: process.env.MONGOOSEMODULE_USER || undefined,
      password: process.env.MONGOOSEMODULE_PASSWORD || undefined
    },
    debug: process.env.MONGOOSEMODULE_DEBUG ? true : false
  };
  let config: ModuleConfig = {
    module: 'MongooseModule',
    type: 'config',
    options: options
  };
  return config;
}

export function MongooseLoggerConfig(): ModuleConfig {
  let options: LoggerOptions = {
    level:  process.env.MONGOOSEMODULE_LOG_LEVEL,
    file: process.env.MONGOOSEMODULE_LOG_FILE,
    console: process.env.MONGOOSEMODULE_LOG_CONSOLE
  };
  let config: ModuleConfig = {
    module: 'LoggerModule',
    type: 'config',
    options: options
  };
  return config;
}
