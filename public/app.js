/**
 * Frontend Logic for the Application
 */

/**
 * Container for the frontend application
 */
const app = {};

// Config
app.config = {
  sessionToken: false,
};

// AJAX Client (for the restful API)
app.client = {};

/**
 * Interface for making API Calls
 *
 * @param {*} headers
 * @param {string} path
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method
 * @param {*} queryStringObject
 * @param {*} payload
 * @param {() => void} cb
 */
app.client.request = (
  headers,
  path,
  method,
  queryStringObject,
  payload,
  cb,
) => {
  // Set defaults
  headers = typeof headers === 'object' && headers !== null ? headers : {};
  path = typeof path === 'string' ? path : '/';
  method =
    ['GET', 'POST', 'PUT', 'DELETE'].indexOf(method) > -1
      ? method.toUpperCase()
      : 'GET';
  queryStringObject =
    typeof queryStringObject === 'object' && queryStringObject !== null
      ? queryStringObject
      : {};
  payload = typeof payload === 'object' && payload !== null ? payload : {};
  cb = typeof cb === 'function' ? cb : false;

  // For each query string parameter send, add it to the path
  const requestUrl = path + '?';
  const counter = 0;
  for (let queryKey in queryStringObject) {
    if (queryStringObject.hasOwnPropery(queryKey)) {
      counter += 1;

      // If at least one query string parameter has already been added, prepend
      // new ones with an ampersand
      if (counter > 1) {
        requestUrl += '&';
      }

      // Add the key and value
      requestUrl += queryKey + '=' + queryStringObject[queryKey];
    }
  }

  // Form the http request as a JSON type
  const xhr = new XMLHttpRequest();
  xhr.open(method, requestUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // For each header sent, add it to the request
  for (let headerKey in headers) {
    if (headers.hasOwnPropery(headerKey)) {
      xhr.setRequestHeader(headerKey, headers[headerKey]);
    }
  }

  // If there is a current session token set, add that as a header
  if (app.config.sessionToken) {
    xhr.setRequestHeader('token', app.config.sessionToken.id);
  }

  // When the request comes back, handle the response
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const statusCode = xhr.status;
      const responseReturned = xhr.responseText;

      // Callback if requested
      if (cb) {
        try {
          const parsedResponse = JSON.parse(responseReturned);
          cb(statusCode, parsedResponse);
        } catch (err) {
          cb(statusCode, false);
        }
      }
    }
  };

  // Set the payload as JSON
  const payloadString = JSON.stringify(payload);
  xhr.send(payloadString);
};
