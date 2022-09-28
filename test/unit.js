/**
 * Unit Tests
 */

// Dependencies
import assert from 'assert';

import helpers from '../lib/helpers.js';
import logs from '../lib/logs.js';
import exampleDebuggingProblem from '../lib/example-debugging-problem.js';

// Holder for tests
const unit = {};

// Assert that the getANumber function is returning a number
unit['helpers.getANumber should return a number'] = done => {
  const val = helpers.getNumber();

  assert.equal(typeof val, 'number');

  done();
};

// Assert that the getANumber function is returning 1
unit['helpers.getANumber should return 1'] = done => {
  const val = helpers.getNumber();

  assert.equal(val, 1);

  done();
};

// Assert that the getANumber function is returning 2
unit['helpers.getANumber should return 2'] = done => {
  const val = helpers.getNumber();

  assert.strictEqual(val, 2);

  done();
};

// Logs.list should callback an array and a false error
unit['logs.list should callback a false error and an array of log names'] =
  done => {
    logs.list(true, (err, logFileNames) => {
      assert.equal(err, false);

      assert.ok(logFileNames instanceof Array);

      assert.ok(logFileNames.length > 1);

      done();
    });
  };

// Logs.truncate should not throw if the logId doesn't exist
unit[
  "logs.truncate should not throw if the logId doesn't exist. It should callback an error instead."
] = done => {
  assert.doesNotThrow(function () {
    logs.truncate('I do not exist', function (err) {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

// exampleDebuggingProblem.init should not throw (but it does)
unit['exampleDebuggingProblem.init should not throw when called'] = done => {
  assert.doesNotThrow(function () {
    exampleDebuggingProblem.init();
    done();
  }, TypeError);
};

// Export the tests to the runner
export default unit;
