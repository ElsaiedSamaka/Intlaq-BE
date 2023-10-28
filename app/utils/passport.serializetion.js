const passport = require("passport");
const db = require("../models");
const User = db.user;

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    // pass user with no error
    cb(null, user);
  });
});
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    // pass user with no error
     cb(null, user);
  });
});
