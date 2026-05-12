const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', getAllUsers);
router.patch('/:id/role', authorize('ADMIN'), updateUserRole);

module.exports = router;
