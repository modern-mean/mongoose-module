/// <reference types="mongoose" />
import { BaseModule, ModuleConfig } from '@modern-mean/server-base-module';
import * as mongoose from 'mongoose';
export declare class MongooseModule extends BaseModule {
    private config;
    constructor(...args: any[]);
    getMongoose(): mongoose.Mongoose;
    connect(): Promise<string>;
    disconnect(): Promise<string>;
}
export interface MongooseOptions {
    uri: string;
    options: any;
    debug: boolean;
}
export declare function MongooseDefaultConfig(): ModuleConfig;
export declare function MongooseLoggerConfig(): ModuleConfig;
