/**
 * Server-related tasks
 */

// Dependencies
import http from 'http';
import https from 'https';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import util from 'util';

import config from './config.js';
import handlers from './handlers.js';
import helpers from './helpers.js';

const debug = util.debuglog('server');

const dirName = path.dirname(fileURLToPath(import.meta.url));

// Instantiate the server module object
const server = {};

// Define a request router
server.router = {
  '': handlers.index,
  'account/create': handlers.accountCreate,
  'account/edit': handlers.accountEdit,
  'account/deleted': handlers.accountDeleted,
  'session/create': handlers.sessionCreate,
  'session/deleted': handlers.sessionDeleted,
  'checks/all': handlers.checksList,
  'checks/create': handlers.checksCreate,
  'checks/edit': handlers.checksEdit,
  'api/users': handlers.users,
  'api/tokens': handlers.tokens,
  'api/checks': handlers.checks,
  ping: handlers.ping,
};

// All the server logic for both the http and https server
server.app = (req, res) => {
  // Get the URL and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  const queryStringObject = parsedUrl.query;

  // Get the HTTP Method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();

    // Choose the handler this request should go to.
    // If one is not found, use the notFound handler
    const chosenHandler = server.router[trimmedPath] || handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload, contentType) => {
      // Determine the type of response (fallback to JSON)
      contentType = typeof contentType === 'string' ? contentType : 'json';

      // Use the status code called back by the handler, or default to 200
      statusCode = typeof statusCode === 'number' ? statusCode : 200;

      // Use the payload called back by the handler, or default to empty object

      // Return the response parts that are content-specific
      let payloadString = '';

      if (contentType === 'json') {
        res.setHeader('Content-Type', 'application/json');
        payload = typeof payload === 'object' ? payload : {};
        payloadString = JSON.stringify(payload);
      }

      if (contentType === 'html') {
        res.setHeader('Content-Type', 'text/html');
        payloadString = typeof payload === 'string' ? payload : '';
      }

      // Return the response-parts thar are common to all content-types
      res.writeHead(statusCode);
      res.end(payloadString);

      // If the response starts with 2 print green, otherwise print red
      if (statusCode.toString().startsWith('2')) {
        debug(
          '\x1b[32m%s\x1b[0m',
          method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode,
        );
      } else {
        debug(
          '\x1b[31m%s\x1b[0m',
          method.toUpperCase() + ' /' + trimmedPath + ' ' + statusCode,
        );
      }
    });
  });
};

// Instantiate the HTTP Server
server.httpServer = http.createServer((req, res) => {
  server.app(req, res);
});

// Instantiate the HTTPS Server
server.httpsServerOptions = {
  key: fs.readFileSync(path.join(dirName, '..', 'https', 'key.pem')),
  cert: fs.readFileSync(path.join(dirName, '..', 'https', 'cert.pem')),
};

server.httpsServer = https.createServer(
  server.httpsServerOptions,
  (req, res) => {
    server.app(req, res);
  },
);

// Init script
server.init = () => {
  // Start the HTTP Server
  server.httpServer.listen(config.httpPort, () => {
    console.log(
      '\x1b[36m%s\x1b[0m',
      `The server is listening on port ${config.httpPort} in ${config.envName} mode`,
    );
  });

  // Start the HTTPS Server
  server.httpsServer.listen(config.httpsPort, () => {
    console.log(
      '\x1b[35m%s\x1b[0m',
      `The server is listening on port ${config.httpsPort} in ${config.envName} mode`,
    );
  });
};

// Expert the module
export default server;
