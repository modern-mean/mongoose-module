import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonPromised from 'sinon-as-promised';
import promised from 'chai-as-promised';
import { config } from '../src/config';

chai.use(promised);
chai.use(sinonChai);

global.expect = chai.expect;
global.should = chai.should();
global.sinon = sinon;
global.config = config;
