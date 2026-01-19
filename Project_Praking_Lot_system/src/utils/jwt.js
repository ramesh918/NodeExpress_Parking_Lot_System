const jwt = require("jsonwebtoken");
const config = require("../config/config");

const signToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn });
};

module.exports = { signToken };