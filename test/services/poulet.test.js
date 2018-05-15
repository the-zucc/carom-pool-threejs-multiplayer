const assert = require('assert');
const app = require('../../src/app');

describe('\'poulet\' service', () => {
  it('registered the service', () => {
    const service = app.service('poulet');

    assert.ok(service, 'Registered the service');
  });
});
