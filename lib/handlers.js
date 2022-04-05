/**
 * Request Handlers
 */

// Dependencies
import _data from './data.js';
import helpers from './helpers.js';

/**
 * Define the handlers
 */
const handlers = {};

/**
 * Users
 * @param {*} data
 * @param {(statusCode: number, payload?: *) => void} cb
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
 * @TODO
 * Cleanup (delete) any other data files associated with this user.
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
        _data.read('users', phone, (err, data) => {
          if (!err && !!data) {
            _data.delete('users', phone, (err) => {
              if (!err) {
                cb(200);
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
