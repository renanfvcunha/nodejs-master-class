/**
 * Create and export configuration variables
 */

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashingSecret: 'randomStagingSecret',
  maxChecks: 5,
  twilio: {
    accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    fromPhone: '+15005550006',
  },
  templateGlobals: {
    appName: 'Uptime Checker',
    companyName: 'Not A Real Company, Inc',
    yearCreated: '2021',
    baseUrl: 'http://localhost:3000/',
  },
};

// Testing environment
environments.testing = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: 'testing',
  hashingSecret: 'randomTestingSecret',
  maxChecks: 5,
  twilio: {
    accountSid: 'ACb32d411ad7fe886aac54c665d25e5c5d',
    authToken: '9455e3eb3109edc12e3d8c92768f7a67',
    fromPhone: '+15005550006',
  },
  templateGlobals: {
    appName: 'Uptime Checker',
    companyName: 'Not A Real Company, Inc',
    yearCreated: '2021',
    baseUrl: 'http://localhost:4000/',
  },
};

// Production environment
environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashingSecret: 'randomProductionSecret',
  maxChecks: 5,
  twilio: {
    accountSid: '',
    authToken: '',
    fromPhone: '',
  },
  templateGlobals: {
    appName: 'Uptime Checker',
    companyName: 'Not A Real Company, Inc',
    yearCreated: '2021',
    baseUrl: 'http://localhost:5000/',
  },
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = process.env.NODE_ENV?.toLowerCase() || 'staging';

// Check that the current environment is one of the environments above,
// if not, default to staging
const environmentToExport = environments[currentEnvironment] || 'staging';

// Export the module
export default environmentToExport;
