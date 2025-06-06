const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getJobApplications,
  getApplicantApplications,
<<<<<<< HEAD
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication,
  getApplicationStats
=======
  updateApplicationStatus
>>>>>>> 3e55399fd15e9a63459b96bd40a32ea305e3bfae
} = require('../controllers/applicationController');
const { authenticate, authorize } = require('../middleware/auth');
const { uploadResume, handleUploadError } = require('../middleware/fileUpload');

<<<<<<< HEAD
// Applicant routes
router.post('/jobs/:jobId/apply', authenticate, authorize('applicant'), applyForJob);
=======
// Apply for a job (applicant only)
router.post('/jobs/:jobId/apply', authenticate, authorize('applicant'), uploadResume, handleUploadError, applyForJob);

// Get applications for a job (company only)
router.get('/jobs/:jobId', authenticate, authorize('company'), getJobApplications);

// Get applicant's applications (applicant only)
>>>>>>> 3e55399fd15e9a63459b96bd40a32ea305e3bfae
router.get('/my-applications', authenticate, authorize('applicant'), getApplicantApplications);
router.delete('/:applicationId/withdraw', authenticate, authorize('applicant'), withdrawApplication);

// Company routes
router.get('/jobs/:jobId', authenticate, authorize('company', 'admin'), getJobApplications);
router.put('/:applicationId/status', authenticate, authorize('company', 'admin'), updateApplicationStatus);

// Admin routes
router.get('/admin/stats', authenticate, authorize('admin'), getApplicationStats);
router.get('/:applicationId', authenticate, authorize('company', 'admin', 'applicant'), getApplicationById);

module.exports = router;
