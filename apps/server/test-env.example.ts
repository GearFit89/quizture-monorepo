// These secrets are only used for test, these will not exist in develop.
// Configure the env from this file and put it in test-env.ts.

const testSecrets = {
  NODE_ENV: 'test',
  REDIS_URL: 'redis://localhost:6379/1', // A test verison of a redis.

  TBQN_BASE_URL: 'redacted', // Hidden by defualt to protect site, ( for the time being)
}

export default testSecrets
