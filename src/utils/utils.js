const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-extraneous-dependencies
const { v4: uuidv4 } = require('uuid');
const {
  JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION,
} = require('../config/appConfig');
const { UnauthorizedError } = require('./errorHandler');

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const createAccessToken = (user, sessionID) => {
  const token = jwt.sign({
    userId: user.id,
    email: user.email,
    role: user.role.id,
    sessionID,
  }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRATION });

  const expiresIn = Math.floor(Date.now() / 1000) + parseInt(JWT_ACCESS_EXPIRATION, 10) * 60;

  return { token, expiresIn };
};

const createRefreshToken = (userId, sessionID = null) => {
  const sessionIDToUse = sessionID || uuidv4();

  const token = jwt.sign({
    userId,
    sessionID: sessionIDToUse,
  }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });

  const expiresIn = Math.floor(Date.now() / 1000) + parseInt(JWT_REFRESH_EXPIRATION, 10) * 86400;

  return { token, expiresIn };
};

const validateRefreshToken = (refreshToken) => {
  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token is required');
  }

  try {
    const { userId, sessionID } = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    return { userId, sessionID };
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }
};

module.exports = {
  generateOtp,
  createAccessToken,
  createRefreshToken,
  validateRefreshToken,
};
