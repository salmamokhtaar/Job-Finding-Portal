const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  updateUserProfile, 
  updateUser, 
  deleteUser 
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authenticate, authorize('admin'), getAllUsers);

// Get user by ID
router.get('/:id', authenticate, getUserById);

// Update user profile (own profile)
router.put('/profile', authenticate, updateUserProfile);

// Update user (admin only)
router.put('/:id', authenticate, authorize('admin'), updateUser);

// Delete user (admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;
