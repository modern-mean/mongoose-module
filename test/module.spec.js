import { MongooseModule } from '../src/module';
import mongoose from 'mongoose';


let sandbox,
  moduleTest;

describe('/src/module', () => {

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    return moduleTest = new MongooseModule();
  });

  afterEach(() => {
    return sandbox.restore();
  });


  describe('constructor', () => {

    it('should be an object', () => {
      return moduleTest.should.be.an('object');
    });

    it('should be instance of MongooseModule', () => {
      return expect(moduleTest instanceof MongooseModule).to.equal(true);
    });

    it('should call mongoose.set with debug if set', () => {
      let spy = sandbox.spy(mongoose, 'set');
      moduleTest = new MongooseModule({ config: { debug: true } });
      return spy.should.be.calledWith('debug', true);
    });

  });

  describe('get', () => {

    it('should return mongoose object', () => {
      return moduleTest.get().connection.should.exist;
    });

  });

  describe('connect', () => {

    describe('success', () => {

      let connectSpy;

      beforeEach(() => {
        connectSpy = sandbox.spy(mongoose, 'connect');
        return moduleTest.connect();
      });

      afterEach(() => {
        return moduleTest.disconnect();
      });

      it('should call mongoose.connect with config', () => {
        return connectSpy.should.have.been.calledWith(moduleTest.config.uri, moduleTest.config.options);
      });

      describe('already connected', () => {

        it('should resolve promise with already connected', () => {
          return moduleTest.connect().should.eventually.be.equal('Already Connected');
        });

      });

    });

    describe('error', () => {

      it('should reject a promise', () => {
        moduleTest = new MongooseModule({ config: { uri: 'testy' } });
        return moduleTest.connect().should.eventually.be.rejected;
      });

    });



  });

  describe('disconnect', () => {

    let disconnectSpy;

    describe('success', () => {

      beforeEach(() => {
        disconnectSpy = sandbox.spy(mongoose, 'disconnect');
        return moduleTest.connect()
          .then(() => moduleTest.disconnect());
      });

      it('should call mongoose.disconnect with config', () => {
        return disconnectSpy.should.have.been.called;
      });

    });

    describe('error', () => {

      it('should reject a promise if there is no connection', () => {
        return moduleTest.disconnect().should.eventually.be.equal('Not Connected');
      });

    });



  });

});
