const { body } = require('express-validator');

const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2, max: 300 })
    .withMessage('Title must be between 2 and 300 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be under 2000 characters'),

  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'])
    .withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),

  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid date format'),

  body('projectId').notEmpty().withMessage('Project ID is required'),

  body('assigneeId').optional().isString().withMessage('Assignee ID must be a string'),
];

const updateTaskValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ min: 2, max: 300 })
    .withMessage('Title must be between 2 and 300 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be under 2000 characters'),

  body('status')
    .optional()
    .isIn(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'])
    .withMessage('Invalid status'),

  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Invalid date format'),

  body('assigneeId').optional({ nullable: true }).isString().withMessage('Assignee ID must be a string'),
];

module.exports = { createTaskValidator, updateTaskValidator };
