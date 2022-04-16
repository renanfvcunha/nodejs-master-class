/**
 * Primary file for the API
 */

// Dependencies
import server from './lib/server.js';
import workers from './lib/workers.js';

// Declare the app
const app = {};

// Init function
app.init = function () {
  // Start the server
  server.init();

  // Start the workers
  workers.init();
};

// Execute
app.init();

// Export the app
export default app;
