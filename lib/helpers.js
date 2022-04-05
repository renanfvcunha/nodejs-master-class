/**
 * Helpers for various tasks
 */

// Dependencies
import crypto from 'crypto';

import config from './config.js';

/**
 * Container for all the helpers
 */
const helpers = {};

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

// Export the module
export default helpers;
