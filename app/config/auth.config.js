module.exports = {
  secret: "auth-secret-key",
  // jwtExpiration: 3600,           // 1 hour
  // jwtRefreshExpiration: 86400,   // 24 hours
  /* for test */
  jwtExpiration:  86400,          // 1 minute
  jwtRefreshExpiration:  86400,  // 2 minutes
  jwtRememberMeExpiration:  86400
};
