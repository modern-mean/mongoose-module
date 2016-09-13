export default () => {
  //https://github.com/winstonjs/winston
  return {
    winston: {
      level:  process.env.MONGOOSEMODULE_LOG_LEVEL,
      file: process.env.MONGOOSEMODULE_LOG_FILE,
      console: process.env.MONGOOSEMODULE_LOG_CONSOLE
    }
  };
};
