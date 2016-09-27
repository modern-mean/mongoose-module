"use strict";
const server_base_module_1 = require('@modern-mean/server-base-module');
const mongoose = require('mongoose');
class MongooseModule extends server_base_module_1.BaseModule {
    constructor(...args) {
        super(MongooseLoggerConfig(), ...args);
        //Set Config
        this.config = this.configModule.getModule('MongooseModule') || this.configModule.defaults(MongooseDefaultConfig());
        //Set Debug
        mongoose.set('debug', this.config.options.debug);
        this.logger.debug('MongooseModule::Constructor::Finished');
    }
    getMongoose() {
        return mongoose;
    }
    connect() {
        return new Promise((resolve, reject) => {
            if (mongoose.connection.readyState !== 0) {
                this.logger.debug('MongooseModule::Connect::Already Connected');
                return resolve('Already Connected');
            }
            this.logger.debug('MongooseModule::Connect::Starting', this.config.options.uri);
            mongoose.connect(this.config.options.uri, this.config.options.options);
            /* istanbul ignore next */
            mongoose.connection.once('error', err => {
                this.logger.error('Mongoose::Error', err);
                return reject(err);
            });
            mongoose.connection.once('open', () => {
                this.logger.debug('Mongoose::Connect::Success');
                return resolve('Connected');
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
exports.MongooseModule = MongooseModule;
function MongooseDefaultConfig() {
    let options = {
        uri: process.env.MONGOOSEMODULE_URI || 'mongodb://localhost/modern-mean-dev',
        options: {
            //http://mongoosejs.com/docs/connections.html
            user: process.env.MONGOOSEMODULE_USER || undefined,
            password: process.env.MONGOOSEMODULE_PASSWORD || undefined
        },
        debug: process.env.MONGOOSEMODULE_DEBUG ? true : false
    };
    let config = {
        module: 'MongooseModule',
        type: 'config',
        options: options
    };
    return config;
}
exports.MongooseDefaultConfig = MongooseDefaultConfig;
function MongooseLoggerConfig() {
    let options = {
        level: process.env.MONGOOSEMODULE_LOG_LEVEL,
        file: process.env.MONGOOSEMODULE_LOG_FILE,
        console: process.env.MONGOOSEMODULE_LOG_CONSOLE
    };
    let config = {
        module: 'LoggerModule',
        type: 'config',
        options: options
    };
    return config;
}
exports.MongooseLoggerConfig = MongooseLoggerConfig;
//# sourceMappingURL=module.js.map