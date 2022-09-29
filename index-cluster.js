/**
 * Primary file for the API
 */

// Dependencies
import { fileURLToPath } from 'url';
import cluster from 'cluster';
import os from 'os';

import server from './lib/server.js';
import workers from './lib/workers.js';
import cli from './lib/cli.js';

// Declare the app
const app = {};

// Init function
app.init = function (cb) {
  // If we're on the master thread, start the background workers and the cli
  if (cluster.isPrimary) {
    // Start the workers
    workers.init();

    // Start the CLI, but make sure it starts last
    setTimeout(function () {
      cli.init();
      cb();
    }, 50);

    for (let i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    // If we're not on the master thread, start the server
    server.init();
  }
};

// Self invoking only if required directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.init(function () {});
}

// Export the app
export default app;
