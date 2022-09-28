/**
 * Primary file for the API
 */

// Dependencies
import { fileURLToPath } from 'url';

import server from './lib/server.js';
import workers from './lib/workers.js';
import cli from './lib/cli.js';

// Declare the app
const app = {};

// Init function
app.init = function (cb) {
  // Start the server
  server.init();

  // Start the workers
  workers.init();

  // Start the CLI, but make sure it starts last
  setTimeout(function () {
    cli.init();
    cb();
  }, 50);
};

// Self invoking only if required directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.init(function () {});
}

// Export the app
export default app;
