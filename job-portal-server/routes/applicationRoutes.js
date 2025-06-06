const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getJobApplications,
  getApplicantApplications,
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication,
  getApplicationStats
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');

// Applicant routes
router.post('/jobs/:jobId/apply', authenticate, authorize('applicant'), applyForJob);
router.get('/my-applications', authenticate, authorize('applicant'), getApplicantApplications);
router.delete('/:applicationId/withdraw', authenticate, authorize('applicant'), withdrawApplication);

// Company routes
router.get('/jobs/:jobId', authenticate, authorize('company', 'admin'), getJobApplications);
router.put('/:applicationId/status', authenticate, authorize('company', 'admin'), updateApplicationStatus);

// Admin routes
router.get('/admin/stats', authenticate, authorize('admin'), getApplicationStats);
router.get('/:applicationId', authenticate, authorize('company', 'admin', 'applicant'), getApplicationById);

module.exports = router;
