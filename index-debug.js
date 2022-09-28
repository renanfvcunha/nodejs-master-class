/**
 * Primary file for the API
 */

// Dependencies
import server from './lib/server.js';
import workers from './lib/workers.js';
import cli from './lib/cli.js';

import exampleDebuggingProblem from './lib/example-debugging-problem.js';

// Declare the app
const app = {};

// Init function
app.init = function () {
  // Start the server

  server.init();

  // Start the workers

  workers.init();

  // Start the CLI, but make sure it starts last

  setTimeout(function () {
    cli.init();
  }, 50);

  let foo = 1;

  // Increment foo
  foo += 1;

  // Square foo
  foo = Math.pow(foo, 2);

  // Convert foo to a string
  foo = foo.toString();

  // Call the init script that will throw
  exampleDebuggingProblem.init();
};

// Execute
app.init();

// Export the app
export default app;
