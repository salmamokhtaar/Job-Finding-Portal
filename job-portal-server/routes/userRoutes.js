const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUser,
  deleteUser,
  getUserStats,
  toggleUserStatus,
  changePassword
} = require('../controllers/userController');
const { authenticate, authorize, authorizeOwnerOrAdmin } = require('../middleware/auth');

// Public/Self routes
router.put('/profile', authenticate, updateUserProfile);
router.put('/change-password', authenticate, changePassword);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/admin/stats', authenticate, authorize('admin'), getUserStats);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
router.patch('/:id/status', authenticate, authorize('admin'), toggleUserStatus);

module.exports = router;
