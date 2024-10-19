// eslint-disable-next-line import/no-extraneous-dependencies
const { body } = require('express-validator');
const validationResultHandler = require('./validationResultHandler');

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email is invalid')
    .normalizeEmail(),

  body('mobile')
    .isMobilePhone()
    .withMessage('Mobile number is invalid'),

  body('role')
    .isInt({ min: 1 })
    .withMessage('Role must be a valid integer')
    .toInt(),

  body('app')
    .isInt()
    .withMessage('App must be a valid integer')
    .toInt(),

  validationResultHandler,
];

module.exports = loginValidation;
