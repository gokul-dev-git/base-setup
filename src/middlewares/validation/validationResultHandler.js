// eslint-disable-next-line import/no-extraneous-dependencies
const { validationResult } = require('express-validator');

// eslint-disable-next-line consistent-return
const validationResultHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().reduce((acc, err) => {
      acc[err.path] = err.msg;
      return acc;
    }, {});

    return res.status(422).json({
      message: 'Validation error',
      errors: formattedErrors,
    });
  }
  next();
};

module.exports = validationResultHandler;
