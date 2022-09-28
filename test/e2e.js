/**
 * E2E tests
 */

// Dependencies
import assert from 'assert';
import http from 'http';

import app from '../index.js';
import config from '../lib/config.js';

// Holder for the tests
const e2e = {};

// Helpers
const helpers = {};
helpers.makeGetRequest = (path, cb) => {
  // Configure the request details
  const requestDetails = {
    protocol: 'http:',
    hostname: 'localhost',
    port: config.httpPort,
    method: 'GET',
    path,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Send the request
  const req = http.request(requestDetails, function (res) {
    cb(res);
  });

  req.end();
};

// The main init function should be able to run without throwing
e2e['app.init should start without throwing'] = done => {
  assert.doesNotThrow(function () {
    app.init(function () {
      done();
    });
  }, TypeError);
};

// Make a request to /ping
e2e['/ping should respond to GET with 200'] = done => {
  helpers.makeGetRequest('/ping', res => {
    assert.strictEqual(res.statusCode, 200);
    done();
  });
};

// Make a request to /api/users
e2e['/api/users should respond to GET with 400'] = done => {
  helpers.makeGetRequest('/api/users', res => {
    assert.strictEqual(res.statusCode, 400);
    done();
  });
};

// Make a request to a random path
e2e['A random path should respond to GET with 404'] = done => {
  helpers.makeGetRequest('/path/unknown', res => {
    assert.strictEqual(res.statusCode, 404);
    done();
  });
};

// Export the tests to the runner
export default e2e;
