const express = require('express');
const router = express.Router();
const { 
  createJob, 
  getAllJobs, 
  getJobById, 
  getCompanyJobs, 
  updateJob, 
  deleteJob 
} = require('../controllers/jobController');
const { authenticate, authorize } = require('../middleware/auth');

// Create a new job (company only)
router.post('/', authenticate, authorize('company', 'admin'), createJob);

// Get all jobs with filters
router.get('/', getAllJobs);

// Get job by ID
router.get('/:id', getJobById);

// Get jobs posted by company
router.get('/company/myjobs', authenticate, authorize('company'), getCompanyJobs);

// Update job (company only)
router.put('/:id', authenticate, authorize('company'), updateJob);

// Delete job (company or admin)
router.delete('/:id', authenticate, authorize('company', 'admin'), deleteJob);

module.exports = router;
