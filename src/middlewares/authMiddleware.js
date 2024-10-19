/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');

const { JWT_ACCESS_SECRET } = require('../config/appConfig');
const { UnauthorizedError } = require('../utils/errorHandler');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new UnauthorizedError('Authorization header is missing'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('Access token is missing'));
  }

  jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
    if (err) {
      return next(new UnauthorizedError('Invalid or expired access token'));
    }
    req.user = user;
    req.sessionID = user.sessionID;
    next();
  });
};

module.exports = authenticate;
