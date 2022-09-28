/**
 * Test runner
 */

// Dependencies
import assert from 'assert';

import helpers from '../lib/helpers.js';

// Application logic for the test runner
const _app = {};

// Container for the tests
_app.tests = {
  unit: {},
};

// Assert that the getANumber function is returning a number
_app.tests.unit['helpers.getANumber should return a number'] = done => {
  const val = helpers.getNumber();

  assert.equal(typeof val, 'number');

  done();
};

// Assert that the getANumber function is returning 1
_app.tests.unit['helpers.getANumber should return 1'] = done => {
  const val = helpers.getNumber();

  assert.equal(val, 1);

  done();
};

// Assert that the getANumber function is returning 2
_app.tests.unit['helpers.getANumber should return 2'] = done => {
  const val = helpers.getNumber();

  assert.strictEqual(val, 2);

  done();
};

// Count all the tests
_app.countTests = function () {
  let counter = 0;

  for (const key in _app.tests) {
    if (Object.hasOwnProperty.call(_app.tests, key)) {
      const subTests = _app.tests[key];

      for (const key in subTests) {
        if (Object.hasOwnProperty.call(subTests, key)) {
          counter += 1;
        }
      }
    }
  }

  return counter;
};

// Produce a test outcome report
_app.produceTestReport = function (limit, successes, errors) {
  console.log('');
  console.log('--------------------BEGIN TEST REPORT--------------------');
  console.log('');
  console.log('Total Tests: %d', limit);
  console.log('Pass: %d', successes);
  console.log('Fail: %d', errors.length);
  console.log('');

  // If there are errors, print then in detail
  if (errors.length > 0) {
    console.log('--------------------BEGIN ERROR DETAILS--------------------');
    console.log('');

    for (const error of errors) {
      console.log('\x1b[31m%s\x1b[0m', error.name);
      console.log(error.error);
      console.log('');
    }

    console.log('');
    console.log('--------------------END ERROR DETAILS--------------------');
  }

  console.log('');
  console.log('--------------------END TEST REPORT--------------------');
};

// Run all the tests, collecting the errors and successes
_app.runTests = () => {
  const errors = [];
  let successes = 0;
  const limit = _app.countTests();
  let counter = 0;

  for (const key in _app.tests) {
    if (Object.hasOwnProperty.call(_app.tests, key)) {
      const subTests = _app.tests[key];

      for (const testName in subTests) {
        if (Object.hasOwnProperty.call(subTests, testName)) {
          (function () {
            const tmpTestName = testName;
            const testValue = subTests[testName];

            // Call the test
            try {
              testValue(function () {
                // If it calls back without throwing, then it succeeded, so lot it in green
                console.log('\x1b[32m%s\x1b[0m', tmpTestName);
                counter += 1;
                successes += 1;
                if (counter === limit) {
                  _app.produceTestReport(limit, successes, errors);
                }
              });
            } catch (err) {
              // If it throws, then it failed, so capture the error thrown and log it in red
              errors.push({
                name: testName,
                error: err,
              });
              console.log('\x1b[31m%s\x1b[0m', tmpTestName);
              counter += 1;
              if (counter === limit) {
                _app.produceTestReport(limit, successes, errors);
              }
            }
          })();
        }
      }
    }
  }
};

// Run the tests
_app.runTests();
