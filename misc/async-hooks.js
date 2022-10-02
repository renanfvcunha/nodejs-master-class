/**
 * Async Hooks Example
 */

// Dependencies
import async_hooks from 'async_hooks';
import fs from 'fs';

// Target execution context
const targetExecutionContext = false;

// Write an arbitraty async function
const whatTimeIsIt = cb => {
  setInterval(function () {
    fs.writeSync(
      1,
      `When the setInterval runs, the execution context is ${async_hooks.executionAsyncId()}\n`,
    );
    cb(Date.now());
  }, 1000);
};

// Call that function
whatTimeIsIt(time => {
  fs.writeSync(1, `The time is ${time}\n`);
});

// Hooks
const hooks = {
  init(asyncId, type, triggerAsyncId, resource) {
    fs.writeSync(1, `Hook init ${asyncId}\n`);
  },
  before(asyncId) {
    fs.writeSync(1, `Hook before ${asyncId}\n`);
  },
  after(asyncId) {
    fs.writeSync(1, `Hook after ${asyncId}\n`);
  },
  destroy(asyncId) {
    fs.writeSync(1, `Hook destroy ${asyncId}\n`);
  },
  promiseResolve(asyncId) {
    fs.writeSync(1, `Hook promiseResolve ${asyncId}\n`);
  },
};

// Create a new AsyncHooks instance
const asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();
