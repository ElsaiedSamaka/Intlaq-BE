const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models").user;
function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}
function comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
}
module.exports = {  
    hashPassword,
    comparePassword
}