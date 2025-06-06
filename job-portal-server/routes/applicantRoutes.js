const express = require('express');
const router = express.Router();
const { 
  getApplicantProfile, 
  updateApplicantProfile,
  getApplicantStats
} = require('../controllers/applicantController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require applicant role
router.use(authenticate, authorize('applicant'));

// Get applicant profile
router.get('/profile', getApplicantProfile);

// Update applicant profile (username only)
router.put('/profile', updateApplicantProfile);

// Get applicant dashboard stats
router.get('/stats', getApplicantStats);

module.exports = router;
