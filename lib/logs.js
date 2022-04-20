/**
 * Library for storing and rotating logs
 */

// Dependencies
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

// Container for the module
const lib = {};
const dirName = path.dirname(fileURLToPath(import.meta.url));

// Base directory of the logs folder
lib.baseDir = path.join(dirName, '..', '.logs');

/**
 * Append a string to a file. Create the file if it does not exist.
 *
 * @param {string} file
 * @param {string} str
 * @param {(error: string | boolean) => void} cb
 */
lib.append = (file, str, cb) => {
  // Open the file for appending
  fs.open(path.join(lib.baseDir, `${file}.log`), 'a', (err, fileDescriptor) => {
    if (!err && !!fileDescriptor) {
      // Append to the file and close it
      fs.appendFile(fileDescriptor, `${str}\n`, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              cb(false);
            } else {
              cb('Error closing file that was being appended');
            }
          });
        } else {
          cb('Error appending to file');
        }
      });
    } else {
      cb('Could not open file for appending');
    }
  });
};

/**
 * List all the logs and optionally include the compressed logs
 *
 * @param {boolean} includeCompressedLogs
 * @param {(error: Error | boolean, data: string[]) => void} cb
 */
lib.list = (includeCompressedLogs, cb) => {
  fs.readdir(lib.baseDir, (err, data) => {
    if (!err && !!data && data.length > 0) {
      const trimmedFileNames = [];

      data.forEach((fileName) => {
        // Add the .log files
        if (fileName.indexOf('.log') > -1) {
          trimmedFileNames.push(fileName.replace('.log', ''));
        }

        // Add on the .gz files
        if (fileName.indexOf('.gz.b64') > -1 && includeCompressedLogs) {
          trimmedFileNames.push(fileName.replace('.gz.b64', ''));
        }
      });

      cb(false, trimmedFileNames);
    } else {
      cb(err, data);
    }
  });
};

/**
 * Compress the contents of one .log file into a .gz.b64 file within the
 * same directory
 *
 * @param {string} logId
 * @param {string} newFileId
 * @param {(error: Error | boolean) => void} cb
 */
lib.compress = (logId, newFileId, cb) => {
  const sourceFile = `${logId}.log`;
  const destFile = `${newFileId}.gz.b64`;

  // Read the source file
  fs.readFile(
    path.join(lib.baseDir, sourceFile),
    'utf-8',
    (err, inputString) => {
      if (!err && !!inputString) {
        // Compress data using gzip
        zlib.gzip(inputString, (err, buffer) => {
          if (!err && !!buffer) {
            // Send the data to the destination file
            fs.open(
              path.join(lib.baseDir, destFile),
              'wx',
              (err, fileDescriptor) => {
                if (!err && !!fileDescriptor) {
                  // Write to the destination file
                  fs.writeFile(
                    fileDescriptor,
                    buffer.toString('base64'),
                    (err) => {
                      if (!err) {
                        // Close the destination file
                        fs.close(fileDescriptor, (err) => {
                          if (!err) {
                            cb(false);
                          } else {
                            cb(err);
                          }
                        });
                      } else {
                        cb(err);
                      }
                    },
                  );
                } else {
                  cb(err);
                }
              },
            );
          } else {
            cb(err);
          }
        });
      } else {
        cb(err);
      }
    },
  );
};

/**
 * Decompress the contents of a .gz.b64 file into a string variable
 *
 * @param {string} fileId
 * @param {(error: Error | boolean, string?: string) => void} cb
 */
lib.decompress = (fileId, cb) => {
  const fileName = `${fileId}.gz.b64`;

  fs.readFile(lib.baseDir + fileName, 'utf-8', (err, str) => {
    if (!err && !!string) {
      // Decompress the data
      const inputBuffer = Buffer.from(str, 'base64');
      zlib.unzip(inputBuffer, (err, outputBuffer) => {
        if (!err && !!outputBuffer) {
          // Callback
          const str = outputBuffer.toString();
          cb(false, str);
        } else {
          cb(err);
        }
      });
    } else {
      cb(err);
    }
  });
};

/**
 * Truncate a log file
 *
 * @param {string} logId
 * @param {(error: Error | boolean) => void} cb
 */
lib.truncate = (logId, cb) => {
  fs.truncate(path.join(lib.baseDir, `${logId}.log`), 0, (err) => {
    if (!err) {
      cb(false);
    } else {
      cb(err);
    }
  });
};

// Export the module
export default lib;
