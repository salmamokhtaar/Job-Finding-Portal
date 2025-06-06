const express = require('express');
const router = express.Router();
const {
  createJob,
  getAllJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
  getJobStats,
  toggleJobStatus,
  getJobApplications
} = require('../controllers/jobController');
const { authenticate, authorize, authorizeOwnerOrAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllJobs); // Get all active jobs with filters
router.get('/:id', getJobById); // Get single job details

// Company routes
router.post('/', authenticate, authorize('company', 'admin'), createJob);
router.get('/company/my-jobs', authenticate, authorize('company'), getCompanyJobs);
router.put('/:id', authenticate, authorize('company', 'admin'), updateJob);
router.delete('/:id', authenticate, authorize('company', 'admin'), deleteJob);
router.patch('/:id/status', authenticate, authorize('company', 'admin'), toggleJobStatus);
router.get('/:id/applications', authenticate, authorize('company', 'admin'), getJobApplications);

// Admin routes
router.get('/admin/stats', authenticate, authorize('admin'), getJobStats);
router.get('/admin/all', authenticate, authorize('admin'), getAllJobs); // Get all jobs including inactive

module.exports = router;
