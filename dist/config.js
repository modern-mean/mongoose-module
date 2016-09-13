'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = () => {
  return {
    uri: process.env.MONGOOSEMODULE_URI || 'mongodb://localhost/modern-mean-dev',
    options: {
      //http://mongoosejs.com/docs/connections.html
      user: process.env.MONGOOSEMODULE_USER || undefined,
      password: process.env.MONGOOSEMODULE_PASSWORD || undefined
    },
    debug: process.env.MONGOOSEMODULE_DEBUG || 'false'
  };
};