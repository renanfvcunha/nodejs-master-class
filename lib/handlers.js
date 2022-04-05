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

// Users
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
 * @TODO
 * Only let an authenticated user access their object.
 * Dont' let them access anyone else's.
 */
handlers._users.get = (data, cb) => {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone === 'string' &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (!!phone) {
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
    cb(400, { message: 'Missing required field' });
  }
};

/**
 * Users - post
 *
 * Required data: firstName, lastName, phone, password, tosAgreement
 *
 * Optional data: none
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
 * @TODO
 * Only let an authenticated user update their own object.
 * Don't let them update anyone else's.
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
 * Only let an authenticated user delete their object.
 * Don't let them delete anyone else's.
 *
 * @TODO
 * Cleanup (delete) any other data files associated with this user.
 */
handlers._users.delete = (data, cb) => {
  // Check that the phone number is valid
  const phone =
    typeof data.queryStringObject.phone === 'string' &&
    data.queryStringObject.phone.trim().length === 10
      ? data.queryStringObject.phone.trim()
      : false;

  if (!!phone) {
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
    cb(400, { message: 'Missing required field' });
  }
};

// Ping Handler
handlers.ping = (data, cb) => {
  cb(200);
};

// Not found handler
handlers.notFound = (data, cb) => {
  // Callback a http status code and a payload object
  cb(404);
};

// Export the module
export default handlers;
