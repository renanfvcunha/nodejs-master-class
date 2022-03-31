/**
 * Create and export configuration variables
 */

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
  port: 3000,
  envName: 'staging',
};

// Production environment
environments.production = {
  port: 5000,
  envName: 'production',
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = process.env.NODE_ENV?.toLowerCase() || 'staging';

// Check that the current environment is one of the environments above,
// if not, default to staging
const environmentToExport = environments[currentEnvironment] || 'staging';

// Export the module
export default environmentToExport;
