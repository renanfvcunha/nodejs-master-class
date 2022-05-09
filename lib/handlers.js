/**
 * Request Handlers
 */

// Dependencies
import _data from './data.js';
import helpers from './helpers.js';
import config from './config.js';

/**
 * Define the handlers
 */
const handlers = {};

/**
 * HTML Handlers
 */

/**
 * Index Handler
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.index = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Uptime Monitoring - Made Simple',
      'head.description':
        "We ofer free, simple uptime monitoring for HTTP/HTTPS sites of all kinds. When your site goes down, we'll send you a text to let you know",
      'body.class': 'index',
    };

    // Read in a template as a string
    helpers.getTemplate('index', templateData, (err, str) => {
      if (!err && !!str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && !!str) {
            // Return that page as HTML
            cb(200, str, 'html');
          } else {
            cb(500, undefined, 'html');
          }
        });
      } else {
        cb(500, undefined, 'html');
      }
    });
  } else {
    cb(405, undefined, 'html');
  }
};

/**
 * Create account handler
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.accountCreate = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Create an Account',
      'head.description': 'Signup is easy and only takes a few seconds.',
      'body.class': 'accountCreate',
    };

    // Read in a template as a string
    helpers.getTemplate('accountCreate', templateData, (err, str) => {
      if (!err && !!str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && !!str) {
            // Return that page as HTML
            cb(200, str, 'html');
          } else {
            cb(500, undefined, 'html');
          }
        });
      } else {
        cb(500, undefined, 'html');
      }
    });
  } else {
    cb(405, undefined, 'html');
  }
};

/**
 * Create new session
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.sessionCreate = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Login to your Account',
      'head.description':
        'Please enter your phone number and password to access your account.',
      'body.class': 'sessionCreate',
    };

    // Read in a template as a string
    helpers.getTemplate('sessionCreate', templateData, (err, str) => {
      if (!err && !!str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && !!str) {
            // Return that page as HTML
            cb(200, str, 'html');
          } else {
            cb(500, undefined, 'html');
          }
        });
      } else {
        cb(500, undefined, 'html');
      }
    });
  } else {
    cb(405, undefined, 'html');
  }
};

/**
 * Session has been deleted
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.sessionDeleted = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Logged out',
      'head.description': 'You have been logged out of your account.',
      'body.class': 'sessionDeleted',
    };

    // Read in a template as a string
    helpers.getTemplate('sessionDeleted', templateData, (err, str) => {
      if (!err && !!str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && !!str) {
            // Return that page as HTML
            cb(200, str, 'html');
          } else {
            cb(500, undefined, 'html');
          }
        });
      } else {
        cb(500, undefined, 'html');
      }
    });
  } else {
    cb(405, undefined, 'html');
  }
};

/**
 * Edit your account
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.accountEdit = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Account Settings',
      'body.class': 'accountEdit',
    };

    // Read in a template as a string
    helpers.getTemplate('accountEdit', templateData, (err, str) => {
      if (!err && !!str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && !!str) {
            // Return that page as HTML
            cb(200, str, 'html');
          } else {
            cb(500, undefined, 'html');
          }
        });
      } else {
        cb(500, undefined, 'html');
      }
    });
  } else {
    cb(405, undefined, 'html');
  }
};

/**
 * Account has been deleted
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.accountDeleted = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Account Deleted',
      'head.description': 'Your account has been deleted',
      'body.class': 'accountDeleted',
    };

    // Read in a template as a string
    helpers.getTemplate('accountDeleted', templateData, (err, str) => {
      if (!err && !!str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && !!str) {
            // Return that page as HTML
            cb(200, str, 'html');
          } else {
            cb(500, undefined, 'html');
          }
        });
      } else {
        cb(500, undefined, 'html');
      }
    });
  } else {
    cb(405, undefined, 'html');
  }
};

/**
 * Create a new check
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.checksCreate = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Prepare data for interpolation
    const templateData = {
      'head.title': 'Create a New Check',
      'body.class': 'checksCreate',
    };

    // Read in a template as a string
    helpers.getTemplate('checksCreate', templateData, (err, str) => {
      if (!err && !!str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && !!str) {
            // Return that page as HTML
            cb(200, str, 'html');
          } else {
            cb(500, undefined, 'html');
          }
        });
      } else {
        cb(500, undefined, 'html');
      }
    });
  } else {
    cb(405, undefined, 'html');
  }
};

/**
 * Favicon
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.favicon = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico', (err, data) => {
      if (!err && !!data) {
        // Callback the data
        cb(200, data, 'favicon');
      } else {
        cb(500);
      }
    });
  } else {
    cb(405);
  }
};

/**
 * Public assets
 * @param {*} data
 * @param {(statusCode: number, payload?: *, contentType?: string) => void} cb
 */
handlers.public = (data, cb) => {
  // Reject any request that isn't a GET
  if (data.method === 'get') {
    // Get the filename being requested
    const trimmedAssetName = data.trimmedPath.replace('public/', '').trim();

    if (trimmedAssetName.length > 0) {
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, (err, data) => {
        if (!err && !!data) {
          // Determine the content type (default to plain text)
          let contentType = 'plain';

          if (trimmedAssetName.includes('.css')) contentType = 'css';
          if (trimmedAssetName.includes('.js')) contentType = 'js';
          if (trimmedAssetName.includes('.png')) contentType = 'png';
          if (trimmedAssetName.includes('.jpg')) contentType = 'jpg';
          if (trimmedAssetName.includes('.ico')) contentType = 'favicon';

          // Callback the data
          cb(200, data, contentType);
        } else {
          cb(404);
        }
      });
    } else {
      cb(404);
    }
  } else {
    cb(405);
  }
};

/**
 * JSON API Handlers
 */

/**
 * Users
 * @param {*} data
 * @param {} cb
 */
handlers.users = (data, cb) => {
  const acceptableMethods = ['get', 'post', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._users[data.method](data, cb);
  } else {
    cb(405);
  }
};

/**
 * Container for the users submethods
 */
handlers._users = {};

/**
 * Users - GET
 *
 * Required data: phone
 *
 * Optional data: none
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._users.get = (data, cb) => {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone === 'string' &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (!!phone) {
    // Get the token from the headers
    const token =
      typeof data.headers.token === 'string'
        ? data.headers.token.trim()
        : false;

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, (err) => {
      if (!err) {
        // Lookup the user
        _data.read('users', phone, (err, data) => {
          if (!err && !!data) {
            // Remove password from the user object before returning it to the request
            delete data.password;
            cb(200, data);
          } else {
            console.error(err);
            cb(404);
          }
        });
      } else {
        cb(403, {
          message: 'Missing required token in header or token is invalid',
        });
      }
    });
  } else {
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Users - post
 *
 * Required data: firstName, lastName, phone, password, tosAgreement
 *
 * Optional data: none
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._users.post = (data, cb) => {
  // Check that all required fields are filled out
  let { firstName, lastName, phone, password, tosAgreement } = data.payload;

  firstName =
    !!firstName && firstName.trim().length > 0 ? firstName.trim() : false;
  lastName = !!lastName && lastName.trim().length > 0 ? lastName.trim() : false;
  phone = !!phone && phone.trim().length === 10 ? phone.trim() : false;
  password = !!password && password.trim().length > 0 ? password.trim() : false;
  tosAgreement = !!tosAgreement ? tosAgreement : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // Make sure that the user doesn't already exist
    _data.read('users', phone, (err, data) => {
      if (err) {
        // Hash the password
        password = helpers.hash(password);

        // Create the user object
        const userObject = {
          firstName,
          lastName,
          phone,
          password,
          tosAgreement,
        };

        // Store the user
        _data.create('users', phone, userObject, (err) => {
          if (!err) {
            cb(201);
          } else {
            console.error(err);
            cb(500, { message: 'Could not create the new user' });
          }
        });
      } else {
        console.error(err);
        // User already exists
        cb(400, { message: 'A user with that phone number already exists' });
      }
    });
  } else {
    cb(400, { message: 'Missing required fields' });
  }
};

/**
 * Users - put
 *
 * Required data: phone
 *
 * Optional data: firstName, lastName, password (at leat one must be specified)
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._users.put = (data, cb) => {
  // Check for the required field
  const phone =
    typeof data.payload.phone === 'string' &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;

  let { firstName, lastName, password } = data.payload;

  firstName =
    !!firstName && firstName.trim().length > 0 ? firstName.trim() : false;
  lastName = !!lastName && lastName.trim().length > 0 ? lastName.trim() : false;
  password = !!password && password.trim().length > 0 ? password.trim() : false;

  // Error if the phone is invalid
  if (!!phone) {
    // Error if nothing is sent to update
    if (firstName || lastName || password) {
      // Get the token from the headers
      const token =
        typeof data.headers.token === 'string' ? data.headers.token : false;

      // Verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(token, phone, (err) => {
        if (!err) {
          // Lookup the user
          _data.read('users', phone, (err, userData) => {
            if (!err && !!userData) {
              // Update the fields necessary
              if (firstName) userData.firstName = firstName;
              if (lastName) userData.lastName = lastName;
              if (password) userData.password = helpers.hash(password);

              // Store the new updates
              _data.update('users', phone, userData, (err) => {
                if (!err) {
                  cb(200);
                } else {
                  console.error(err);
                  cb(500, { message: 'Internal server error' });
                }
              });
            } else {
              console.error(err);
              cb(400, { message: 'The specified user does not exist' });
            }
          });
        } else {
          cb(403, {
            message: 'Missing required token in header or token is invalid',
          });
        }
      });
    } else {
      cb(400, { message: 'Missing field to update' });
    }
  } else {
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Users - delete
 *
 * Required field: phone
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._users.delete = (data, cb) => {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone === 'string' &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (!!phone) {
    // Get the token from the headers
    const token =
      typeof data.headers.token === 'string' ? data.headers.token : false;

    // Verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, (err) => {
      if (!err) {
        // Lookup the user
        _data.read('users', phone, (err, userData) => {
          if (!err && !!userData) {
            _data.delete('users', phone, (err) => {
              if (!err) {
                // Delete each of the checks associated with the user
                const userChecks =
                  typeof userData.checks === 'object' &&
                  userData.checks instanceof Array
                    ? userData.checks
                    : [];

                const checksToDelete = userChecks.length;

                if (checksToDelete > 0) {
                  let checksDeleted = 0;
                  let deletionErrors = false;

                  // Loop through the checks
                  userChecks.forEach((checkId) => {
                    // Delete the check
                    _data.delete('checks', checkId, (err) => {
                      if (err) {
                        deletionErrors = true;
                      }
                      checksDeleted += 1;
                      if (checksDeleted === checksToDelete) {
                        if (!deletionErrors) {
                          cb(200);
                        } else {
                          cb(500, {
                            message:
                              'Errors encountered while attempting to delete all the users checks. All checks may not have been deleted from the system successfuly',
                          });
                        }
                      }
                    });
                  });
                } else {
                  cb(200);
                }
              } else {
                console.error(err);
                cb(500, { message: 'Internal server error' });
              }
            });
          } else {
            console.error(err);
            cb(400, { message: 'Could not find the specified user' });
          }
        });
      } else {
        cb(403, {
          message: 'Missing required token in header or token is invalid',
        });
      }
    });
  } else {
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Tokens
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers.tokens = (data, cb) => {
  const acceptableMethods = ['get', 'post', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._tokens[data.method](data, cb);
  } else {
    cb(405);
  }
};

// Container for all the tokens methods
handlers._tokens = {};

/**
 * Tokens - GET
 *
 * Required data: id
 *
 * Optional data: none
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._tokens.get = (data, cb) => {
  // Check that the id is valid
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  if (!!id) {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && !!tokenData) {
        cb(200, tokenData);
      } else {
        console.error(err);
        cb(404);
      }
    });
  } else {
    cb(400, { message: 'Missing required fields' });
  }
};

/**
 * Tokens - POST
 *
 * Required data: phone, password
 *
 * Optional data: none
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._tokens.post = (data, cb) => {
  // Check that all required fields are filled out
  let { phone, password } = data.payload;

  phone = !!phone && phone.trim().length === 10 ? phone.trim() : false;
  password = !!password && password.trim().length > 0 ? password.trim() : false;

  if (!!phone && !!password) {
    // Lookup the user who matches that phone number
    _data.read('users', phone, (err, userData) => {
      if (!err && !!userData) {
        // Hash the sent password and compare it to the password stored in
        // the user object
        password = helpers.hash(password);

        if (password === userData.password) {
          // If valid, create a new token with a random name. Set expiration
          // date 1 hour in the future
          const tokenId = helpers.createRandomString(20);

          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            phone,
            id: tokenId,
            expires,
          };

          // Store the token
          _data.create('tokens', tokenId, tokenObject, (err) => {
            if (!err) {
              cb(200, tokenObject);
            } else {
              console.error(err);
              cb(500, { message: 'Internal server error' });
            }
          });
        } else {
          cb(400, {
            message:
              "Password did not match the specified user's stored password",
          });
        }
      } else {
        console.error(err);
        cb(400, { message: 'Could not find the specified user' });
      }
    });
  } else {
    cb(400, { message: 'Missing required field(s)' });
  }
};

/**
 * Tokens - PUT
 *
 * Required data: id, extend
 *
 * Optional data: none
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._tokens.put = (data, cb) => {
  let { id, extend } = data.payload;

  id = !!id && id.trim().length === 20 ? id.trim() : false;
  extend = !!extend ? extend : false;

  if (id && extend) {
    // Lookup the token
    _data.read('tokens', id, (err, tokenData) => {
      if (!err && tokenData) {
        // Check to make sure the token isn't already expired
        if (tokenData.expires > Date.now()) {
          // Set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          // Store the new updates
          _data.update('tokens', id, tokenData, (err) => {
            if (!err) {
              cb(200);
            } else {
              console.error(err);
              cb(500, { message: 'Internal server error' });
            }
          });
        } else {
          cb(422, {
            message: 'The token has already expired and can not be extended',
          });
        }
      } else {
        console.error(err);
        cb(400, { message: 'Specified token does not exist' });
      }
    });
  } else {
    cb(400, { message: 'Missing required field(s) or field(s) are invalid' });
  }
};

/**
 * Tokens - DELETE
 *
 * Required data: id
 *
 * Optional data: none
 *
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._tokens.delete = (data, cb) => {
  // Check that the id is valid
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  if (!!id) {
    // Lookup the user
    _data.read('tokens', id, (err, data) => {
      if (!err && !!data) {
        _data.delete('tokens', id, (err) => {
          if (!err) {
            cb(200);
          } else {
            console.error(err);
            cb(500, { message: 'Internal server error' });
          }
        });
      } else {
        console.error(err);
        cb(400, { message: 'Could not find the specified token' });
      }
    });
  } else {
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Verify if a given id is currently valid for a given user
 *
 * @param {string} id
 * @param {string} phone
 * @param {(error: boolean) => void} cb
 */
handlers._tokens.verifyToken = (id, phone, cb) => {
  // Lookup the token
  _data.read('tokens', id, (err, tokenData) => {
    if (!err && !!tokenData) {
      // Check that the token is for the given user and has not expired
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        cb(false);
      } else {
        cb(true);
      }
    } else {
      console.error(err);
      cb(true);
    }
  });
};

/**
 * Checks
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers.checks = (data, cb) => {
  const acceptableMethods = ['get', 'post', 'put', 'delete'];
  if (acceptableMethods.indexOf(data.method) !== -1) {
    handlers._checks[data.method](data, cb);
  } else {
    cb(405);
  }
};

/**
 * Container for all the checks methods
 */
handlers._checks = {};

/**
 * Checks - GET
 *
 * Required data: id
 *
 * Optional data: none
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._checks.get = (data, cb) => {
  // Check that the id number is valid
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  if (!!id) {
    // Lookup the check
    _data.read('checks', id, (err, checkData) => {
      if (!err && checkData) {
        // Get the token from the headers
        const token =
          typeof data.headers.token === 'string'
            ? data.headers.token.trim()
            : false;

        // Verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(token, checkData.userPhone, (err) => {
          if (!err) {
            // Return the check data
            cb(200, checkData);
          } else {
            cb(403);
          }
        });
      } else {
        cb(404);
      }
    });
  } else {
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Checks - POST
 *
 * Required data: protocol, url, method, successCodes, timeoutSeconds
 *
 * Optional data: none
 * @param {{ payload: {
 * protocol: 'http' | 'https',
 * url: string,
 * method: 'get' | 'post' | 'put' | 'delete',
 * successCodes: [],
 * timeoutSeconds: number
 * }
 * }} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._checks.post = (data, cb) => {
  // Validate inputs
  let { protocol, url, method, successCodes, timeoutSeconds } = data.payload;

  protocol =
    !!protocol && ['http', 'https'].indexOf(protocol) > -1 ? protocol : false;
  url = !!url && url.trim().length > 0 ? url.trim() : false;
  method =
    !!method && ['get', 'post', 'put', 'delete'].indexOf(method) > -1
      ? method
      : false;
  successCodes =
    !!successCodes && successCodes instanceof Array && successCodes.length > 0
      ? successCodes
      : false;
  timeoutSeconds =
    !!timeoutSeconds &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    // Get the token from the headers
    const token =
      typeof data.headers.token === 'string' ? data.headers.token : false;

    // Lookup the user by reading the token
    _data.read('tokens', token, (err, tokenData) => {
      if (!err && !!tokenData) {
        const userPhone = tokenData.phone;

        // Lookup the user data
        _data.read('users', userPhone, (err, userData) => {
          if (!err) {
            const userChecks =
              typeof userData.checks === 'object' &&
              userData.checks instanceof Array
                ? userData.checks
                : [];

            // Verify that the user has less than the number of max-checks-per-user
            if (userChecks.length < config.maxChecks) {
              // Create a random id for the check
              const checkId = helpers.createRandomString(20);

              // Create the check object, and include the user's phone
              const checkObject = {
                id: checkId,
                userPhone,
                protocol,
                url,
                method,
                successCodes,
                timeoutSeconds,
              };

              // Save the object
              _data.create('checks', checkId, checkObject, (err) => {
                if (!err) {
                  // Add the check id to the user's object
                  userData.checks = userChecks;
                  userData.checks.push(checkId);

                  // Save the new user data
                  _data.update('users', userPhone, userData, (err) => {
                    if (!err) {
                      // Return the data about the new check
                      cb(201, checkObject);
                    } else {
                      console.error(err);
                      cb(500, { message: 'Internal server error' });
                    }
                  });
                } else {
                  console.error(err);
                  cb(500, { message: 'Internal server error' });
                }
              });
            } else {
              cb(400, {
                message: `The user already has the maximum number of checks (${config.maxChecks})`,
              });
            }
          } else {
            console.error(err);
            cb(403);
          }
        });
      } else {
        console.error(err);
        cb(403);
      }
    });
  } else {
    cb(400, { message: 'Missing required inputs or inputs are invalid' });
  }
};

/**
 * Checks - PUT
 *
 * Required data: protocol, url, method, successCodes, timeoutSeconds
 * (one must be sent)
 *
 * Optional data:
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._checks.put = (data, cb) => {
  // Check for the required field
  const id =
    typeof data.payload.id === 'string' && data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;

  // Check for the optional fields
  let { protocol, url, method, successCodes, timeoutSeconds } = data.payload;

  protocol =
    !!protocol && ['http', 'https'].indexOf(protocol) > -1 ? protocol : false;
  url = !!url && url.trim().length > 0 ? url.trim() : false;
  method =
    !!method && ['get', 'post', 'put', 'delete'].indexOf(method) > -1
      ? method
      : false;
  successCodes =
    !!successCodes && successCodes instanceof Array && successCodes.length > 0
      ? successCodes
      : false;
  timeoutSeconds =
    !!timeoutSeconds &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  // Check to make sure id is valid
  if (id) {
    // Check to make sure one or more optional fields has been sent
    if (protocol || url || method || successCodes || timeoutSeconds) {
      // Lookup the check
      _data.read('checks', id, (err, checkData) => {
        if (!err && !!checkData) {
          // Get the token from the headers
          const token =
            typeof data.headers.token === 'string'
              ? data.headers.token.trim()
              : false;

          // Verify that the given token is valid and belongs to the user who created the check
          handlers._tokens.verifyToken(token, checkData.userPhone, (err) => {
            if (!err) {
              // Update the check where necessary
              if (protocol) checkData.protocol = protocol;
              if (url) checkData.url = url;
              if (method) checkData.method = method;
              if (successCodes) checkData.successCodes = successCodes;
              if (timeoutSeconds) checkData.timeoutSeconds = timeoutSeconds;

              // Store the updates
              _data.update('checks', id, checkData, (err) => {
                if (!err) {
                  cb(200);
                } else {
                  console.error(err);
                  cb(500, { message: 'Could not update the check' });
                }
              });
            } else {
              cb(403);
            }
          });
        } else {
          console.error(err);
          cb(400, { message: 'Check ID did not exist' });
        }
      });
    } else {
      cb(400, { message: 'Missing fields to update' });
    }
  } else {
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Checks - DELETE
 *
 * Required data: id
 *
 * Optional data: none
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers._checks.delete = (data, cb) => {
  // Check that the id is valid
  const id =
    typeof data.queryStringObject.id === 'string' &&
    data.queryStringObject.id.trim().length === 20
      ? data.queryStringObject.id.trim()
      : false;

  if (!!id) {
    // Lookup the check
    _data.read('checks', id, (err, checkData) => {
      if (!err && !!checkData) {
        // Get the token from the headers
        const token =
          typeof data.headers.token === 'string' ? data.headers.token : false;

        // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token, checkData.userPhone, (err) => {
          if (!err) {
            // Delete the check data
            _data.delete('checks', id, (err) => {
              if (!err) {
                // Lookup the user
                _data.read('users', checkData.userPhone, (err, userData) => {
                  if (!err && !!userData) {
                    const userChecks =
                      typeof userData.checks === 'object' &&
                      userData.checks instanceof Array
                        ? userData.checks
                        : [];

                    // Remove the deleted check from their list of checks
                    const checkPosition = userChecks.indexOf(id);

                    if (checkPosition > -1) {
                      userChecks.splice(checkPosition, 1);

                      // Resave the user's data
                      _data.update(
                        'users',
                        checkData.userPhone,
                        userData,
                        (err) => {
                          if (!err) {
                            cb(200);
                          } else {
                            console.error(err);
                            cb(500, { message: 'Could not update the user' });
                          }
                        },
                      );
                    } else {
                      cb(500, {
                        message:
                          "Could not find the check on the user's object, so could not remove it",
                      });
                    }
                  } else {
                    console.error(err);
                    cb(500, {
                      message:
                        'Could not find the user who created the check, so could not remove the check from the list of checks on the user object',
                    });
                  }
                });
              } else {
                console.error(err);
                cb(500, { message: 'Could not delete the check' });
              }
            });
          } else {
            cb(403);
          }
        });
      } else {
        console.error(err);
        cb(400, { message: 'The specified check id does not exist' });
      }
    });
  } else {
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Ping Handler
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers.ping = (data, cb) => {
  cb(200);
};

/**
 * Not found handler
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
 */
handlers.notFound = (data, cb) => {
  // Callback a http status code and a payload object
  cb(404);
};

// Export the module
export default handlers;
