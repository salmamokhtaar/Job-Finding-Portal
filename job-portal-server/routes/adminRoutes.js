const express = require('express');
const router = express.Router();
const { 
  getAllJobsAdmin, 
  updateJobApproval, 
  getSystemStats,
  createUser
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin role
router.use(authenticate, authorize('admin'));

// Get all jobs with approval status
router.get('/jobs', getAllJobsAdmin);

// Approve or reject a job
router.put('/jobs/:id/approval', updateJobApproval);

// Get system statistics for admin dashboard
router.get('/stats', getSystemStats);

// Create a new user
router.post('/users', createUser);

module.exports = router;
