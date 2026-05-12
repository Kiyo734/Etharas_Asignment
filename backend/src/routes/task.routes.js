const express = require('express');
const router = express.Router();
const { getTasks, createTask, getTask, updateTask, deleteTask } = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { createTaskValidator, updateTaskValidator } = require('../validators/task.validator');

router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTaskValidator, validate, createTask);
router.get('/:id', getTask);
router.patch('/:id', updateTaskValidator, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
