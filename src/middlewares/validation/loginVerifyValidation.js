// eslint-disable-next-line import/no-extraneous-dependencies
const { body } = require('express-validator');
const validationResultHandler = require('./validationResultHandler');

const loginVerifyValidation = [
  body('user_id')
    .isInt({ min: 1 })
    .withMessage('User ID must be a valid integer')
    .toInt(),

  body('email_otp')
    .isInt({ min: 100000, max: 999999 })
    .withMessage('Email OTP must be a 6-digit number')
    .toInt(),

  body('mobile_otp')
    .isInt({ min: 100000, max: 999999 })
    .withMessage('Mobile OTP must be a 6-digit number')
    .toInt(),

  body('app')
    .isInt({ min: 1 })
    .withMessage('App must be a valid integer')
    .toInt(),

  validationResultHandler,
];

module.exports = loginVerifyValidation;
