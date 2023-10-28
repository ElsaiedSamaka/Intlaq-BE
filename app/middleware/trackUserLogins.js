const user_logins = require("../models").user_logins;
function trackUserLogin(userId) {
  // track user login
  const userLogin = new user_logins({
    user_id: userId,
    login_time: new Date(),
  });

  userLogin.save();
}
const userLogin = {
  trackUserLogin,
};
module.exports = userLogin;
