const express = require('express');
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addMember,
  removeMember
} = require('../controllers/projectController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// All project routes require authentication
router.use(auth);

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Admin only)
router.post('/', roleCheck(['admin']), createProject);

// @route   GET /api/projects
// @desc    Get all projects
// @access  Private
router.get('/', getProjects);

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Admin or Project Creator)
router.put('/:id', updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Admin or Project Creator)
router.delete('/:id', deleteProject);

// @route   POST /api/projects/:id/members
// @desc    Add member to project
// @access  Private (Admin only)
router.post('/:id/members', roleCheck(['admin']), addMember);

// @route   DELETE /api/projects/:id/members/:memberId
// @desc    Remove member from project
// @access  Private (Admin only)
router.delete('/:id/members/:memberId', roleCheck(['admin']), removeMember);

module.exports = router;