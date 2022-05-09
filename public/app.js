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

/**
 * Bind the forms
 */
app.bindForms = function () {
  document.querySelector('form').addEventListener('submit', function (e) {
    // Stop it from submitting
    e.preventDefault();
    var formId = this.id;
    var path = this.action;
    var method = this.method.toUpperCase();

    // Hide the error message (if it's currently shown due to a previous error)
    document.querySelector('#' + formId + ' .formError').style.display =
      'hidden';

    // Turn the inputs into a payload
    var payload = {};
    var elements = this.elements;
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].type !== 'submit') {
        var valueOfElement =
          elements[i].type == 'checkbox'
            ? elements[i].checked
            : elements[i].value;
        payload[elements[i].name] = valueOfElement;
      }
    }

    // Call the API
    app.client.request(
      undefined,
      path,
      method,
      undefined,
      payload,
      function (statusCode, responsePayload) {
        // Display an error on the form if needed
        if (!statusCode.toString().startsWith('2')) {
          // Try to get the error from the api, or set a default error message
          var error =
            typeof responsePayload.Error == 'string'
              ? responsePayload.Error
              : 'An error has occured, please try again';

          // Set the formError field with the error text
          document.querySelector('#' + formId + ' .formError').innerHTML =
            error;

          // Show (unhide) the form error field on the form
          document.querySelector('#' + formId + ' .formError').style.display =
            'block';
        } else {
          // If successful, send to form response processor
          app.formResponseProcessor(formId, payload, responsePayload);
        }
      },
    );
  });
};

// Form response processor
app.formResponseProcessor = function (formId, requestPayload, responsePayload) {
  var functionToCall = false;
  if (formId === 'accountCreate') {
    // @TODO Do something here now that the account has been created successfully
  }
};

// Init (bootstrapping)
app.init = function () {
  // Bind all form submissions
  app.bindForms();
};

// Call the init processes after the window loads
window.onload = function () {
  app.init();
};
