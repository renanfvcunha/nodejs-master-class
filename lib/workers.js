/**
 * Worker-related tasks
 */

// Dependencies
import path from 'path';
import fs from 'fs';
import http from 'http';
import https from 'https';
import { URL } from 'url';
import util from 'util';

import helpers from './helpers.js';
import _data from './data.js';
import _logs from './logs.js';

const debug = util.debuglog('workers');

// Instantiate the worker object
const workers = {};

// Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = () => {
  // Get all the checks
  _data.list('checks', (err, checks) => {
    if (!err && !!checks && checks.length > 0) {
      checks.forEach((check) => {
        // Read in the check data
        _data.read('checks', check, (err, originalCheckData) => {
          if (!err && !!originalCheckData) {
            // Pass it to the check validator and
            // let that function continue or log error as needed
            workers.validateCheckData(originalCheckData);
          } else {
            debug('Error reading one of the checks data');
          }
        });
      });
    } else {
      debug('Error: Could not find any checks to process');
    }
  });
};

/**
 * Sanity-check the check-data
 * @param {*} originalCheckData
 */
workers.validateCheckData = (originalCheckData) => {
  originalCheckData =
    typeof originalCheckData === 'object' && originalCheckData !== null
      ? originalCheckData
      : {};

  let {
    id,
    userPhone,
    protocol,
    url,
    method,
    successCodes,
    timeoutSeconds,
    state,
    lastChecked,
  } = originalCheckData;

  id = typeof id === 'string' && id.trim().length === 20 ? id.trim() : false;
  userPhone =
    typeof userPhone === 'string' && userPhone.trim().length === 10
      ? userPhone.trim()
      : false;
  protocol = ['http', 'https'].indexOf(protocol) > -1 ? protocol : false;
  url = typeof url === 'string' && url.trim().length > 0 ? url.trim() : false;
  method =
    ['get', 'post', 'put', 'delete'].indexOf(method) > -1 ? method : false;
  successCodes =
    successCodes instanceof Array && successCodes.length > 0
      ? successCodes
      : false;
  timeoutSeconds =
    typeof timeoutSeconds === 'number' &&
    timeoutSeconds % 1 === 0 &&
    timeoutSeconds >= 1 &&
    timeoutSeconds <= 5
      ? timeoutSeconds
      : false;

  // Set the keys that may not be set (if the workers have never seen this check before)
  state = !!state && ['up', 'down'].indexOf(state) > -1 ? state : 'down';
  lastChecked = !!lastChecked && lastChecked > 0 ? lastChecked : false;

  // If all the checks pass, pass the data along to the next step in the process
  if (
    id &&
    userPhone &&
    protocol &&
    url &&
    method &&
    successCodes &&
    timeoutSeconds
  ) {
    workers.performCheck(originalCheckData);
  } else {
    debug('Error: One of the checks is not properly formatted. Skipping it.');
  }
};

/**
 * Perform the check, send the originalCheckData and the outcome of the check
 * process to the next step in the process
 *
 * @param {*} originalCheckData
 */
workers.performCheck = (originalCheckData) => {
  // Prepare the initial check outcome
  let checkOutcome = {
    error: false,
    responseCode: false,
  };

  // Mark the outcome has not been sent yet
  let outcomeSent = false;

  // Parse the hostname and the path out of the original check data
  const parsedUrl = new URL(
    `${originalCheckData.protocol}://${originalCheckData.url}`,
  );
  const hostName = parsedUrl.hostname;
  const path = parsedUrl.search;

  // Construct the request
  const requestDetails = {
    protocol: originalCheckData.protocol + ':',
    hostName,
    method: originalCheckData.method.toUpperCase(),
    path,
    timeout: originalCheckData.timeoutSeconds * 1000,
  };

  // Instantiate the request object (using either the http or https module)
  const _moduleToUse = originalCheckData.protocol === 'http' ? http : https;
  const req = _moduleToUse.request(requestDetails, (res) => {
    // Grab the status of the sent request
    const status = res.statusCode;

    // Update the checkOutcome and pass the data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Bind to the error event so it doesn't get thrown
  req.on('error', (e) => {
    // Update the checkOutcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: e,
    };

    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // Bind to the timeout event
  req.on('timeout', () => {
    // Update the checkOutcome and pass the data along
    checkOutcome.error = {
      error: true,
      value: 'timeout',
    };

    if (!outcomeSent) {
      workers.processCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // End the request
  req.end();
};

/**
 * Process the check outcome, update the check data as needed, trigger an alert
 * if needed
 *
 * Special logic for accomodating a check that has never been tested before
 * (don't alert on that one)
 *
 * @param {*} originalCheckData
 * @param {*} checkOutcome
 */
workers.processCheckOutcome = (originalCheckData, checkOutcome) => {
  // Decide if the check is considered up or down
  const state =
    !checkOutcome.error &&
    !!checkOutcome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? 'up'
      : 'down';

  // Decide if an alert is warranted
  const alertWarranted =
    originalCheckData.lastChecked && originalCheckData.state !== state;

  // Log the outcome
  const timeOfCheck = Date.now();
  workers.log(
    originalCheckData,
    checkOutcome,
    state,
    alertWarranted,
    timeOfCheck,
  );

  // Update the check data
  let newCheckData = originalCheckData;
  newCheckData.state = state;
  newCheckData.lastChecked = timeOfCheck;

  // Save the updates
  _data.update('checks', newCheckData.id, newCheckData, (err) => {
    if (!err) {
      // Send the new check data to the next phase in the process if needed
      if (alertWarranted) {
        workers.alertUserToStatusChange(newCheckData);
      } else {
        debug('Check outcome has not changed, no alert needed.');
      }
    } else {
      debug('Error trying to save updates to one of the checks');
    }
  });
};

// Alert the user as to a change in their check status
workers.alertUserToStatusChange = (newCheckData) => {
  const message = `Alert: Your check for ${newCheckData.method.toUpperCase()} ${
    newCheckData.protocol
  }://${newCheckData.url} is currently ${newCheckData.state}`;

  helpers.sendTwilioSms(newCheckData.userPhone, message, (err) => {
    if (!err) {
      debug(
        'Sucess: User was alerted to a status change in their check, via sms',
        message,
      );
    } else {
      debug(
        'Error: could not send sms alert to user who had a state change in their check',
      );
    }
  });
};

/**
 *
 * @param {*} originalCheckData
 * @param {*} checkOutcome
 * @param {'up' | 'down'} state
 * @param {*} alertWarranted
 * @param {number} timeOfCheck
 */
workers.log = (
  originalCheckData,
  checkOutcome,
  state,
  alertWarranted,
  timeOfCheck,
) => {
  // Form the log data
  const logData = {
    check: originalCheckData,
    outCome: checkOutcome,
    state,
    alert: alertWarranted,
    time: timeOfCheck,
  };

  // Convert data to a string
  var logString = JSON.stringify(logData);

  // Determine the name of the log file
  const logFileName = originalCheckData.id;

  // Append the log string to the file
  _logs.append(logFileName, logString, (err) => {
    if (!err) {
      debug('Logging to file succeeded');
    } else {
      debug('Logging to file failed');
    }
  });
};

// Timer to execute the worker-process once per minute
workers.loop = () => {
  setInterval(() => {
    workers.gatherAllChecks();
  }, 1000 * 60);
};

/**
 * Rotate (compress) the log files
 */
workers.rotateLogs = () => {
  // List all the (non compressed) log files
  _logs.list(false, (err, logs) => {
    if (!err && !!logs && logs.length > 0) {
      logs.forEach((logName) => {
        // Compress the data to a different file
        const logId = logName.replace('.log', '');
        const newFileId = `${logId}-${Date.now()}`;
        _logs.compress(logId, newFileId, (err) => {
          if (!err) {
            // Truncate the log
            _logs.truncate(logId, (err) => {
              if (!err) {
                debug('Success truncate logFile');
              } else {
                debug(err);
              }
            });
          } else {
            debug('Error compressing one of the log files', err);
          }
        });
      });
    } else {
      debug('Error: could not find any logs to rotate');
    }
  });
};

/**
 * Timer to execute the log-rotation process once per day
 */
workers.logRotationLoop = () => {
  setInterval(() => {
    workers.rotateLogs();
  }, 1000 * 60 * 60 * 24);
};

// Init script
workers.init = () => {
  // Send to console in yellow
  console.log('\x1b[33m%s\x1b[0m', 'Background workers are running');

  // Execute all the checks immediately
  workers.gatherAllChecks();

  // Call the loop so the checks will execute later on
  workers.loop();

  // Compress all the logs immediately
  workers.rotateLogs();

  // Call the compression loop so logs will be compressed later on
  workers.logRotationLoop();
};

// Export the module
export default workers;
