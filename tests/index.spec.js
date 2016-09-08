import * as indexTest from '../src/index';


let sandbox;

describe('/src/index', () => {

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });


  describe('export', () => {

    it('should export module class', () => {
      return indexTest.MongooseModule.should.exist;
    });

  });

});
