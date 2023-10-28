const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
module.exports = (sequelize, Sequelize) => {
const RememberMeToken = sequelize.define('remember_me', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
    }
})
RememberMeToken.createRememberMeToken = async function (user) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRememberMeExpiration);

  const _token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: config.jwtRememberMeExpiration,
  })

    let rememberMeToken = await this.create({
      token: _token,
      user_id: user.id,
      expiresAt: expiredAt.getTime(),
    });

    return rememberMeToken.token;
  };
  RememberMeToken.verifyExpiration = (token) => {
    return token.expiryDate.getTime() < new Date().getTime();
  }
return RememberMeToken;
}