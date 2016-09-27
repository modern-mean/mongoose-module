import * as test from 'blue-tape';
import * as testModule from '../src/module';
import * as mongoose from 'mongoose';
import * as sinon from 'sinon';

let moduleTest = new testModule.MongooseModule();

test('module.ts MongooseModule constructor', (assert) => {
  assert.pass('should run successfully');
  assert.equal(mongoose.get('debug'), false, 'should set debug false by default');
  assert.end();
});

test('module.ts MongooseModule connect', (assert) => {
  let sandbox = sinon.sandbox.create();
  let connectSpy = sandbox.spy(mongoose, 'connect');
  let config = testModule.MongooseDefaultConfig();
  moduleTest.connect()
    .then(res => {
      assert.equal(res, 'Connected', 'should resolve Connected string');
      assert.equal(connectSpy.called, true, 'should call mongoose.connect');
      assert.equal(connectSpy.args[0][0], config.options.uri, 'should call mongoose.connect with default URI');
      assert.equal(moduleTest.getMongoose().connection.readyState, 1, 'mongoose readyState should be 1');
      sandbox.restore();
      moduleTest.disconnect();
      assert.end();
    });
});

test('module.ts MongooseModule connect when already connected', (assert) => {
  let sandbox = sinon.sandbox.create();
  let connectSpy;
  moduleTest.connect()
    .then(res => {
      connectSpy = sandbox.spy(mongoose, 'connect');
    })
    .then(res => moduleTest.connect())
    .then((res) => {
      assert.equal(res, 'Already Connected', 'should resolve Already Connected string');
      assert.equal(connectSpy.called, false, 'should not call mongoose.connect');
      sandbox.restore();
      moduleTest.disconnect();
      assert.end();
    });
});

test('module.ts MongooseModule getMongoose()', (assert) => {
  let ret = moduleTest.getMongoose();
  assert.equal(ret instanceof mongoose.Mongoose, true , 'should return the mongoose instance');
  assert.end();
});

test('module.ts MongooseModule disconnect', (assert) => {
  let sandbox = sinon.sandbox.create();
  let disconnectSpy = sandbox.spy(mongoose, 'disconnect');
  moduleTest.connect()
    .then(ret => moduleTest.disconnect())
    .then(ret => {
      assert.equal(ret, 'Disconnected', 'should resolve Disconnected string');
      assert.equal(disconnectSpy.called, true, 'should call mongoose.disconnect');
      assert.equal(moduleTest.getMongoose().connection.readyState, 0, 'mongoose readyState should be 0');
      sandbox.restore();
      assert.end();
    });
});

test('module.ts MongooseModule disconnect when not connected', (assert) => {
  let sandbox = sinon.sandbox.create();
  let disconnectSpy = sandbox.spy(mongoose, 'disconnect');
  moduleTest.disconnect()
    .then(ret => {
      assert.equal(ret, 'Not Connected', 'should resolve Not Connected string');
      assert.equal(disconnectSpy.called, false, 'should not call mongoose.disconnect');
      assert.equal(moduleTest.getMongoose().connection.readyState, 0, 'mongoose readyState should be 0');
      sandbox.restore();
      assert.end();
    });
});

test('module.ts MongooseModule should be configurable via environment variables', (assert) => {
  let sandbox = sinon.sandbox.create();
  let connectStub = sandbox.stub(mongoose, 'connect').returns(new Promise((resolve, reject) => {
    return resolve();
  }));

  process.env.MONGOOSEMODULE_URI = 'surething';
  process.env.MONGOOSEMODULE_USER = 'testuser';
  process.env.MONGOOSEMODULE_PASSWORD = 'testpassword';
  process.env.MONGOOSEMODULE_DEBUG = 1;

  moduleTest = new testModule.MongooseModule();
  moduleTest.connect();
  setTimeout(() => {
    assert.equal(mongoose.get('debug'), true, 'set debug');
    assert.equal(connectStub.args[0][0], process.env.MONGOOSEMODULE_URI, 'set mongoose URI');
    assert.equal(connectStub.args[0][1].user, process.env.MONGOOSEMODULE_USER, 'set mongoose user');
    assert.equal(connectStub.args[0][1].password, process.env.MONGOOSEMODULE_PASSWORD, 'set mongoose password');
    sandbox.restore();
    assert.end();
  }, 1000);
});




