// eslint-disable-next-line import/no-extraneous-dependencies
const { body } = require('express-validator');
const validationResultHandler = require('./validationResultHandler');

const createRoleValidation = [
  body('role_name')
    .notEmpty().withMessage('Role name is required')
    .isLength({ min: 3 })
    .withMessage('Role name must be at least 3 characters long')
    .isString()
    .withMessage('Role name must be a string'),

  body('role_desc')
    .optional()
    .isLength({ max: 255 }).withMessage('Role description must be less than 255 characters')
    .isString()
    .withMessage('Role description must be a string'),

  validationResultHandler,
];

module.exports = createRoleValidation;
