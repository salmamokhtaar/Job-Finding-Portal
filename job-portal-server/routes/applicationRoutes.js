const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getJobApplications,
  getApplicantApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadResume, handleUploadError } = require('../middleware/fileUpload');

// Apply for a job (applicant only)
router.post('/jobs/:jobId/apply', authenticate, authorize('applicant'), uploadResume, handleUploadError, applyForJob);

// Get applications for a job (company only)
router.get('/jobs/:jobId', authenticate, authorize('company'), getJobApplications);

// Get applicant's applications (applicant only)
router.get('/my-applications', authenticate, authorize('applicant'), getApplicantApplications);

// Update application status (company only)
router.put('/:applicationId/status', authenticate, authorize('company'), updateApplicationStatus);

module.exports = router;
