const config = require("../config/auth.config");

var jwt = require("jsonwebtoken");

const createAccessToken = (id) => {
  return jwt.sign({ id: id }, config.secret, {
    expiresIn: config.jwtExpiration, // 48 hours
  });
};
module.exports = createAccessToken;
