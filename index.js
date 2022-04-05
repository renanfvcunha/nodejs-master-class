/**
 * Primary file for the API
 */

// Dependencies
import http from 'http';
import https from 'https';
import url from 'url';
import { StringDecoder } from 'string_decoder';
import fs from 'fs';

import config from './lib/config.js';
import handlers from './lib/handlers.js';
import helpers from './lib/helpers.js';

// Define a request router
const router = {
  ping: handlers.ping,
  users: handlers.users,
};

// All the server logic for both the http and https server
const app = (req, res) => {
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
    const chosenHandler = router[trimmedPath] || handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: helpers.parseJsonToObject(buffer),
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called back by the handler, or default to 200
      statusCode = statusCode || 200;

      // Use the payload called back by the handler, or default to empty object
      payload = payload || {};

      // Convert the payload to a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      // Log the request path
      console.log('Returning this response: ', statusCode, payloadString);
    });
  });
};

// Instantiate the HTTP Server
const httpServer = http.createServer((req, res) => {
  app(req, res);
});

// Start the HTTP Server
httpServer.listen(config.httpPort, () => {
  console.log(
    `The server is listening on port ${config.httpPort} in ${config.envName} mode`,
  );
});

// Instantiate the HTTPS Server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  app(req, res);
});

// Start the HTTPS Server
httpsServer.listen(config.httpsPort, () => {
  console.log(
    `The server is listening on port ${config.httpsPort} in ${config.envName} mode`,
  );
});
