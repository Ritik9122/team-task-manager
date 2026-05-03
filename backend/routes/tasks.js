const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(auth);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', createTask);

// @route   GET /api/tasks
// @desc    Get all tasks (with optional filters)
// @access  Private
router.get('/', getTasks);

// @route   GET /api/tasks/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/dashboard/stats', getDashboardStats);

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', getTaskById);

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private (Admin or Task Creator)
router.delete('/:id', deleteTask);

module.exports = router;