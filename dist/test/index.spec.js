"use strict";
const test = require('blue-tape');
const indexTest = require('../src/index');
test('index.ts export MongooseModule', (assert) => {
    assert.notEqual(indexTest.MongooseModule, undefined, 'Should not be undefined');
    assert.end();
});
test('index.ts export MongooseDefaultConfig', (assert) => {
    assert.equal(typeof indexTest.MongooseDefaultConfig, 'function', 'Should be a function');
    assert.end();
});
test('index.ts export MongooseLoggerConfig', (assert) => {
    assert.equal(typeof indexTest.MongooseLoggerConfig, 'function', 'Should be a function');
    assert.end();
});
//# sourceMappingURL=index.spec.js.map