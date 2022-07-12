/**
 * CLI-Related Tasks
 */

// Dependencies
import readline from 'readline';
import util from 'util';
import events from 'events';

const debug = util.debuglog('cli');

class _events extends events {}

const e = new _events();

// Instantiate the CLI module object
const cli = {};

// Input processor
cli.processInput = function (str) {
  str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : false;

  // Only process the input if the user actually wrote something. Otherwise ignore it.
  if (str) {
    // Codify the unique strings that identify the unique questions allowed to be asked
    const uniqueInputs = [
      'man',
      'help',
      'exit',
      'stats',
      'list users',
      'more user info',
      'list checks',
      'more check info',
      'list logs',
      'more log info',
    ];

    // Go through the possible inputs, emit an event when a match is found
    let matchFound = false;
    let counter = 0;
    uniqueInputs.some(function (input) {
      if (str.toLowerCase().indexOf(input) > -1) {
        matchFound = true;

        // Emit an event matching the unique input and include the full string given
        e.emit(input, str);

        return true;
      }
    });

    // If no match is found, tell the user to try again
    if (!matchFound) {
      console.log('Sorry, try again');
    }
  }
};

// Input handlers
e.on('man', function () {
  cli.responders.help();
});

e.on('help', function () {
  cli.responders.help();
});

e.on('exit', function () {
  cli.responders.exit();
});

e.on('stats', function () {
  cli.responders.stats();
});

e.on('list users', function () {
  cli.responders.listUsers();
});

e.on('more user info', function (str) {
  cli.responders.moreUserInfo(str);
});

e.on('list checks', function (str) {
  cli.responders.listChecks(str);
});

e.on('more check info', function (str) {
  cli.responders.moreCheckInfo(str);
});

e.on('list logs', function () {
  cli.responders.listLogs();
});

e.on('more log info', function (str) {
  cli.responders.moreLogsInfo(str);
});

// Responders object
cli.responders = {};

// Help / Man
cli.responders.help = function () {
  const commands = {
    exit: 'Kill the CLI (and the rest of the application)',
    man: 'Show this help page',
    help: 'Alias of the "man" command',
    stats:
      'Get statistics on the underlying operating system and resource utilization',
    'list users':
      'Show a list of all the registered (undeleted) users in the system',
    'more user info --{userId}': 'Show details of a specific user',
    'list checks --up --down':
      'Show a list of the active checks in the system, including their state. The "--up" and the "--down" flags are both optional',
    'more check info --{checkId}': 'Show details of a specified check',
    'list logs':
      'Show a list of all the log files available to be read (compressed and uncompressed)',
    'more log info --{fileName}': 'Show details of a specified log file',
  };

  // Create a horizontal line across the screen
  cli.horizontalLine = function () {
    // Get the available screen size
    const width = process.stdout.columns;

    let line = '';

    for (let i = 0; i < width; i++) {
      line += '-';
    }

    console.log(line);
  };

  // Create centered text on the screen
  cli.centered = function (str) {
    str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : '';

    // Get the available screen size
    const width = process.stdout.columns;

    // Calculate the left padding there should be
    const leftPadding = Math.floor((width - str.length) / 2);

    // Put in left padded spaces before the string itself
    let line = '';

    for (let i = 0; i < leftPadding; i++) {
      line += ' ';
    }

    line += str;

    console.log(line);
  };

  // Create a vertical space
  cli.verticalSpace = function (lines) {
    lines = typeof lines === 'number' && lines > 0 ? lines : 1;

    for (let i = 0; i < lines; i++) {
      console.log('');
    }
  };

  // Show a header for the help page that is as wide as the screen
  cli.horizontalLine();
  cli.centered('CLI MANUAL');
  cli.horizontalLine();
  cli.verticalSpace(2);

  // Show each command, followed by its explanation, in white and yellow respectively

  for (const key in commands) {
    if (commands.hasOwnProperty(key)) {
      const value = commands[key];
      let line = '\x1b[33m' + key + '\x1b[0m';
      const padding = 60 - line.length;

      for (let i = 0; i < padding; i++) {
        line += ' ';
      }
      line += value;
      console.log(line);
      cli.verticalSpace();
    }
  }

  cli.verticalSpace(1);

  // End with another horizontalLine
  cli.horizontalLine();
};

// Exit
cli.responders.exit = function () {
  process.exit(0);
};

// Stats
cli.responders.stats = function () {
  console.log('You asked for stats');
};

// List Users
cli.responders.listUsers = function () {
  console.log('You asked to list users');
};

// More user info
cli.responders.moreUserInfo = function (str) {
  console.log('You asked for more info', str);
};

// List Checks
cli.responders.listChecks = function (str) {
  console.log('You asked to list checks', str);
};

// More check info
cli.responders.moreCheckInfo = function (str) {
  console.log('You asked for more check info', str);
};

// List logs
cli.responders.listLogs = function () {
  console.log('You asked to list logs');
};

// More logs info
cli.responders.moreLogsInfo = function (str) {
  console.log('You asked for more log info', str);
};

// Init script
cli.init = function () {
  // Send the start message to the console, in dark blue
  console.log('\x1b[34m%s\x1b[0m', 'The cli is running!');

  // Start the interface
  const _interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> ',
  });

  // Create an initial prompt
  _interface.prompt();

  // Handle each line of input separetely
  _interface.on('line', function (str) {
    // Send to the input processor
    cli.processInput(str);

    // Re-initialize the prompt afterwards
    _interface.prompt();
  });

  // If the user stops the CLI, kill the associated process
  _interface.on('close', function () {
    process.exit(0);
  });
};

// Export the module
export default cli;