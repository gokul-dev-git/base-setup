const { AppError } = require('../utils/errorHandler');
const { logger } = require('./logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  if (!err.isOperational) {
    // eslint-disable-next-line no-param-reassign
    err = new AppError('Something went wrong!', 500);
  }

  res.status(err.statusCode).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
