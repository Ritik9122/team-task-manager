const express = require('express');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { registerUser, loginUser, getCurrentUser, getUsers } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current user information
// @access  Private
router.get('/me', auth, getCurrentUser);

// @route   GET /api/auth/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, roleCheck(['admin']), getUsers);

module.exports = router;