import { MongooseModule } from '../src/module';


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

  });

  describe('get', () => {

    it('should return itself', () => {
      return expect(moduleTest.get() instanceof MongooseModule).equal(true);
    });

  });

});
