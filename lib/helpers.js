/**
 * Helpers for various tasks
 */

// Dependencies
import crypto from 'crypto';
import { URLSearchParams, fileURLToPath } from 'url';
import https from 'https';
import path from 'path';
import fs from 'fs';

import config from './config.js';

/**
 * Container for all the helpers
 */
const helpers = {};

// Define dirName while using ES Modules instead of CommonJS
const dirName = path.dirname(fileURLToPath(import.meta.url));

/**
 * Create a SHA256 hash
 * @param {string} str The string to hash
 * @returns A hashed string
 */
helpers.hash = (str) => {
  if (typeof str === 'string' && str.length > 0) {
    const hash = crypto
      .createHmac('sha256', config.hashingSecret)
      .update(str)
      .digest('hex');

    return hash;
  } else {
    return false;
  }
};

/**
 * Parse a JSON string to an object in all cases, without throwing
 * @param {string} str String to Parse
 * @returns Parsed Object
 */
helpers.parseJsonToObject = (str) => {
  try {
    const obj = JSON.parse(str);
    return obj;
  } catch (err) {
    return {};
  }
};

/**
 * Create a string of random alphanumeric characters of a given length
 * @param {number} strLength The string returned length
 */
helpers.createRandomString = (strLength) => {
  strLength =
    typeof strLength === 'number' && strLength > 0 ? strLength : false;

  if (!!strLength) {
    // Define all the possible characteres that could go into a string
    const possibleCharacteres = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    let str = '';

    for (let i = 0; i < strLength; i++) {
      // Get a random character from the possibleCharacteres string
      const randomCharacter = possibleCharacteres.charAt(
        Math.floor(Math.random() * possibleCharacteres.length),
      );

      // Append this character to the final string
      str += randomCharacter;
    }

    // Return the final string
    return str;
  } else {
    return false;
  }
};

/**
 * Send an SMS messave via Twilio
 *
 * @param {string} phone
 * @param {string} message
 * @param {(error: string | boolean | Error) => void} cb
 */
helpers.sendTwilioSms = (phone, message, cb) => {
  // Validate parameters
  phone =
    typeof phone === 'string' && phone.trim().length === 10
      ? phone.trim()
      : false;
  message =
    typeof message === 'string' &&
    message.trim().length > 0 &&
    message.trim().length <= 1600
      ? message.trim()
      : false;

  if (phone && message) {
    // Configure the request payload
    const payload = {
      From: config.twilio.fromPhone,
      To: '+55' + phone,
      Body: message,
    };

    // Stringify the payload
    const stringPayload = new URLSearchParams(payload).toString();

    // Configure the request details
    const requestDetails = {
      protocol: 'https:',
      hostname: 'api.twilio.com',
      method: 'POST',
      path: `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
      auth: `${config.twilio.accountSid}:${config.twilio.authToken}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(stringPayload),
      },
    };

    // Instantiate the request object
    const req = https.request(requestDetails, (res) => {
      // Grab the status of the sent request
      const status = res.statusCode;

      // Callback successfully if the request went through
      if (status.toString().startsWith('2')) {
        cb(false);
      } else {
        cb(`Status code returned was: ${status}`);
      }
    });

    // Bind to the error event so it doesn't get thrown
    req.on('error', (err) => {
      cb(err);
    });

    // Add the payload
    req.write(stringPayload);

    // End the request
    req.end();
  } else {
    cb('Given parameters were missing or invalid');
  }
};

/**
 * Get the string content of a template
 *
 * @param {string} templateName
 * @param {*} data
 * @param {(err: string | boolean, data?: string) => void} cb
 */
helpers.getTemplate = (templateName, data, cb) => {
  templateName =
    typeof templateName === 'string' && templateName.length > 0
      ? templateName
      : false;
  data = typeof data === 'object' && data !== null ? data : {};

  if (!!templateName) {
    const templatesDir = path.join(dirName, '..', 'templates');
    fs.readFile(
      path.join(templatesDir, `${templateName}.html`),
      'utf-8',
      (err, str) => {
        if (!err && !!str && str.length > 0) {
          // Do interpolation on the string
          const finalString = helpers.interpolate(str, data);

          cb(false, finalString);
        } else {
          cb('No template could be found');
        }
      },
    );
  } else {
    cb('A valid template name was not specified');
  }
};

/**
 * Add the universal header and footer to a string, and pass provided data
 * object to the header and footer for interpolation
 *
 * @param {string} str
 * @param {*} data
 * @param {(error: string | boolean, data?: string) => void} cb
 */
helpers.addUniversalTemplates = (str, data, cb) => {
  str = typeof str === 'string' && str.length > 0 ? str : '';
  data = typeof data === 'object' && data !== null ? data : {};

  // Get the header
  helpers.getTemplate('_header', data, (err, headerString) => {
    if (!err && !!headerString) {
      // Get the footer
      helpers.getTemplate('_footer', data, (err, footerString) => {
        if (!err && !!footerString) {
          // Add them all together
          const fullString = headerString + str + footerString;
          cb(false, fullString);
        } else {
          cb('Could not find the footer template');
        }
      });
    } else {
      cb('Could not find the header template');
    }
  });
};

/**
 * Take a given string and a data object and find/replace all the keys within it
 *
 * @param {string} str
 * @param {*} data
 */
helpers.interpolate = (str, data) => {
  str = typeof str === 'string' && str.length > 0 ? str : '';
  data = typeof data === 'object' && data !== null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with "global"
  for (var keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data[`global.${keyName}`] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object, insert its value into the string at the
  // corresponding placeholder
  for (var key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === 'string') {
      const replace = data[key];
      const find = '{' + key + '}';
      str = str.replace(find, replace);
    }
  }

  return str;
};

/**
 * Get the contents of a static (public) asset
 * @param {string} fileName
 * @param {(error: string | boolean, data?: *) => void} cb
 */
helpers.getStaticAsset = (fileName, cb) => {
  fileName =
    typeof fileName === 'string' && fileName.length > 0 ? fileName : false;

  if (!!fileName) {
    const publicDir = path.join(dirName, '..', 'public');

    fs.readFile(path.join(publicDir, fileName), (err, data) => {
      if (!err && !!data) {
        cb(false, data);
      } else {
        console.error(err);
        cb('No file could be found');
      }
    });
  } else {
    cb('A valid file name was not specified');
  }
};

// Export the module
export default helpers;
