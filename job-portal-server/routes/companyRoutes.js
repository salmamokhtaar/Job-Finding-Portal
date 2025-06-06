const express = require('express');
const router = express.Router();
const { 
  getCompanyJobs, 
  getCompanyProfile, 
  updateCompanyProfile,
  getCompanyStats
} = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require company role
router.use(authenticate, authorize('company'));

// Get company's jobs with approval status
router.get('/jobs', getCompanyJobs);

// Get company profile
router.get('/profile', getCompanyProfile);

// Update company profile
router.put('/profile', updateCompanyProfile);

// Get company dashboard stats
router.get('/stats', getCompanyStats);

module.exports = router;
