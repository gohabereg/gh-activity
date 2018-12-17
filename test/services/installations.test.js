const assert = require('assert');
const app = require('../../src/app');

describe('\'installations\' service', () => {
  it('registered the service', () => {
    const service = app.service('installations');

    assert.ok(service, 'Registered the service');
  });
});
