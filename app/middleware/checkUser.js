const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models").user;
const { TokenExpiredError } = require("jsonwebtoken");

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).json({ message: "Unauthorized! Access Token was expired!" });
  }
  return res.status(401).json({ message: "Unauthorized!" });
}
const isLoggedIn =async (req, res, next) => {
  const accessToken = req.session.accessToken;
  const refreshToken = req.cookies.refreshToken;
  const rememberMeToken = req.cookies.rememberMeToken;
  
  if (!accessToken && !refreshToken) {
    return res.status(403).json({
      message: "No token provided!",
      authentication: false,
      username: null,
    });
  }
  // Check if the access token is present and valid
  if (accessToken) {
    jwt.verify(accessToken, config.secret, (err, decoded) => {
      if (err) {
        return catchError(err, res);
      }
      req.userId = decoded.id;
      next();
    });
  }
  // Check if the refresh token is present and valid
  if (refreshToken) {
    decoded = jwt.verify(refreshToken, config.secret);

    // Find the associated user based on the decoded ID
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(403).json({
        message: 'Invalid refresh token!',
        authentication: false,
        username: null,
      });
    }

    // Generate a new access token for the user
    const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });

    // Store the new access token in the response
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      // Other cookie options (e.g., expiration, domain, etc.)
    });

    req.userId = user.id;
    return next();
  }
  // Check if the remember me token is present and valid
  if (rememberMeToken) {
    decoded = jwt.verify(rememberMeToken, config.secret);
    req.userId = decoded.id;
    return next();
  }
};

const isActive = async (req, res, next) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user.isActive) {
    return res.status(403).json({ message: "User not active" });
  }
  next();
};
const checkUser = {
  isLoggedIn,
  isActive,
};
module.exports = checkUser;
