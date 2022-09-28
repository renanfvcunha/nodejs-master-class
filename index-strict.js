/**
 * Primary file for the API
 */

// Dependencies
import server from './lib/server.js';
import workers from './lib/workers.js';
import cli from './lib/cli.js';

// Declare the app
const app = {};

// Declare a global (that strict mode should catch)
foo = 'bar';

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
};

// Execute
app.init();

// Export the app
export default app;
