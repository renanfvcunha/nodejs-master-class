/**
 * Library for storing and editing data
 */

// Dependencies
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Container for the module (to be exported)
const lib = {};
const dirName = path.dirname(fileURLToPath(import.meta.url));

// Base directory of the data folder
lib.baseDir = path.join(dirName, '..', '.data');

// Write data to a file
lib.create = (dir, file, data, cb) => {
  // Open the file for writing
  fs.open(
    path.join(lib.baseDir, dir, `${file}.json`),
    'wx',
    (err, fileDescriptor) => {
      if (!err && !!fileDescriptor) {
        // Convert data to string
        const stringData = JSON.stringify(data);

        // Write to file and close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, (err) => {
              if (!err) {
                cb(false);
              } else {
                console.error(err);
                cb('Error closing new file');
              }
            });
          } else {
            console.error(err);
            cb('Error writing to new file');
          }
        });
      } else {
        console.error(err);
        cb('Could not create new file, it may already exist');
      }
    },
  );
};

// Read data from a file
lib.read = (dir, file, cb) => {
  fs.readFile(
    path.join(lib.baseDir, dir, `${file}.json`),
    'utf-8',
    (err, data) => {
      cb(err, data);
    },
  );
};

// Update data inside a file
lib.update = (dir, file, data, cb) => {
  // Open the file for writing
  fs.open(
    path.join(lib.baseDir, dir, `${file}.json`),
    'r+',
    (err, fileDescriptor) => {
      if (!err && !!fileDescriptor) {
        // Convert data to string
        const stringData = JSON.stringify(data);

        // Truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            // Write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    cb(false);
                  } else {
                    console.error(err);
                    cb('Error closing the file');
                  }
                });
              } else {
                console.error(err);
                cb('Error writing to existing file');
              }
            });
          } else {
            console.error(err);
            cb('Error truncating file');
          }
        });
      } else {
        console.error(err);
        cb('Could not open the file for updating, it may not exist yet');
      }
    },
  );
};

// Delete a file
lib.delete = (dir, file, cb) => {
  // Unlink the file
  fs.unlink(path.join(lib.baseDir, dir, `${file}.json`), (err) => {
    if (!err) {
      cb(false);
    } else {
      console.error(err);
      cb('Error deleting the file');
    }
  });
};

// Export the module
export default lib;
