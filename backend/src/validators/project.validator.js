const { body } = require('express-validator');

const createProjectValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be under 1000 characters'),

  body('status')
    .optional()
    .isIn(['ACTIVE', 'COMPLETED', 'ARCHIVED'])
    .withMessage('Invalid status'),
];

const updateProjectValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project name cannot be empty')
    .isLength({ min: 2, max: 200 })
    .withMessage('Name must be between 2 and 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be under 1000 characters'),

  body('status')
    .optional()
    .isIn(['ACTIVE', 'COMPLETED', 'ARCHIVED'])
    .withMessage('Invalid status'),
];

const addMemberValidator = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('role')
    .optional()
    .isIn(['ADMIN', 'MEMBER'])
    .withMessage('Role must be ADMIN or MEMBER'),
];

module.exports = { createProjectValidator, updateProjectValidator, addMemberValidator };
