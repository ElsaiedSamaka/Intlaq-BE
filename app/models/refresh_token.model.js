const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");

module.exports = (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refresh_token", {
      token: {
        type: Sequelize.STRING,
      },
      expiryDate: {
        type: Sequelize.DATE,
      },
    });
  
    RefreshToken.createRefreshToken = async function (user) {
      let expiredAt = new Date();
  
      expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);
  
    const _token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtRefreshExpiration,
    })
  
      let refreshToken = await this.create({
        token: _token,
        userId: user.id,
        expiryDate: expiredAt.getTime(),
      });
  
      return refreshToken.token;
    };
  
    RefreshToken.verifyExpiration = (token) => {
      return token.expiryDate.getTime() < new Date().getTime();
    };
  
    return RefreshToken;
  };