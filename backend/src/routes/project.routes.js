const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getMembers,
} = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const {
  createProjectValidator,
  updateProjectValidator,
  addMemberValidator,
} = require('../validators/project.validator');

router.use(authenticate);

router.get('/', getProjects);
router.post('/', createProjectValidator, validate, createProject);
router.get('/:id', getProject);
router.patch('/:id', updateProjectValidator, validate, updateProject);
router.delete('/:id', deleteProject);

router.get('/:id/members', getMembers);
router.post('/:id/members', addMemberValidator, validate, addMember);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
