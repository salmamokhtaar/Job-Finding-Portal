const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const mongoose = require('mongoose');
const path = require('path');

// Apply for a job (applicant only)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { fullName, username, email, coverLetter } = req.body;
    const applicantId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

<<<<<<< HEAD
    // Check if resume is provided
    if (!resume) {
=======
    // Check if resume file was uploaded
    if (!req.file) {
>>>>>>> 3e55399fd15e9a63459b96bd40a32ea305e3bfae
      return res.status(400).json({
        message: "Resume file is required for job application.",
        status: false
      });
    }

<<<<<<< HEAD
=======
    // Get resume file path
    const resumePath = `/uploads/resumes/${req.file.filename}`;

    // Validate required fields
    if (!fullName || !username || !email) {
      return res.status(400).json({
        message: "Full name, username, and email are required for job application.",
        status: false
      });
    }

>>>>>>> 3e55399fd15e9a63459b96bd40a32ea305e3bfae
    // Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

<<<<<<< HEAD
    // Check if job is active
    if (job.status !== 'active') {
=======
    // Check if job is active and approved
    if (job.status !== 'active' || job.approvalStatus !== 'approved') {
>>>>>>> 3e55399fd15e9a63459b96bd40a32ea305e3bfae
      return res.status(400).json({
        message: "This job is not active or has not been approved yet.",
        status: false
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job.",
        status: false
      });
    }

    // Create application
    const application = new Application({
      job: jobId,
      applicant: applicantId,
      company: job.postedBy,
      fullName,
      username,
      email,
      resume: resumePath,
      coverLetter,
      status: 'pending',
      appliedDate: Date.now()
    });

    await application.save();

    // Update job applicants array
    await Job.findByIdAndUpdate(jobId, {
      $push: {
        applicants: {
          applicant: applicantId,
          status: 'pending',
          appliedDate: Date.now(),
          resume: resumePath,
          coverLetter
        }
      }
    });

    res.status(201).json({
      message: "Application submitted successfully.",
      status: true,
      application
    });
  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({
      message: "Server error while submitting application.",
      status: false
    });
  }
};

// Get applications for a job (company only)
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const companyId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

    // Find job and check ownership
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

    // Check if the user is the job poster
    if (job.postedBy.toString() !== companyId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only view applications for your own job postings.",
        status: false
      });
    }

    // Get applications
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'username email applicantProfile')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      status: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      message: "Server error while fetching applications.",
      status: false
    });
  }
};

// Get applicant's applications (applicant only)
const getApplicantApplications = async (req, res) => {
  try {
    const applicantId = req.user._id;

    // Get applications
    const applications = await Application.find({ applicant: applicantId })
      .populate('job', 'jobTitle companyName jobLocation status')
      .populate('company', 'username companyProfile.companyName companyProfile.companyLogo')
      .sort({ appliedDate: -1 });

    res.status(200).json({
      status: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    console.error('Get applicant applications error:', error);
    res.status(500).json({
      message: "Server error while fetching applications.",
      status: false
    });
  }
};

// Update application status (company only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes } = req.body;
    const companyId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID format.",
        status: false
      });
    }

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'interviewed', 'offered', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: pending, reviewed, interviewed, offered, rejected",
        status: false
      });
    }

    // Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        status: false
      });
    }

    // Check if the user is the company that posted the job
    if (application.company.toString() !== companyId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only update applications for your own job postings.",
        status: false
      });
    }

    // Update application
    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      {
        $set: {
          status,
          notes: notes || application.notes,
          updatedAt: Date.now()
        }
      },
      { new: true, runValidators: true }
    ).populate('applicant', 'username email');

    // Update job applicants array
    await Job.updateOne(
      {
        _id: application.job,
        'applicants.applicant': application.applicant
      },
      {
        $set: {
          'applicants.$.status': status
        }
      }
    );

    res.status(200).json({
      message: "Application status updated successfully.",
      status: true,
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      message: "Server error while updating application status.",
      status: false
    });
  }
};

// Get application by ID (applicant/company/admin)
const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID format.",
        status: false
      });
    }

    // Find application
    const application = await Application.findById(applicationId)
      .populate('job', 'jobTitle companyName jobLocation')
      .populate('applicant', 'username email applicantProfile')
      .populate('company', 'username companyProfile.companyName');

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        status: false
      });
    }

    // Check authorization
    const isApplicant = application.applicant._id.toString() === userId.toString();
    const isCompany = application.company._id.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isApplicant && !isCompany && !isAdmin) {
      return res.status(403).json({
        message: "Access denied. You can only view your own applications.",
        status: false
      });
    }

    res.status(200).json({
      status: true,
      application
    });
  } catch (error) {
    console.error('Get application by ID error:', error);
    res.status(500).json({
      message: "Server error while fetching application.",
      status: false
    });
  }
};

// Withdraw application (applicant only)
const withdrawApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const applicantId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({
        message: "Invalid application ID format.",
        status: false
      });
    }

    // Find application
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        status: false
      });
    }

    // Check if user is the applicant
    if (application.applicant.toString() !== applicantId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only withdraw your own applications.",
        status: false
      });
    }

    // Check if application can be withdrawn
    if (['offered', 'rejected'].includes(application.status)) {
      return res.status(400).json({
        message: "Cannot withdraw application that has been offered or rejected.",
        status: false
      });
    }

    // Remove application
    await Application.findByIdAndDelete(applicationId);

    // Remove from job applicants array
    await Job.updateOne(
      { _id: application.job },
      {
        $pull: {
          applicants: { applicant: applicantId }
        }
      }
    );

    res.status(200).json({
      message: "Application withdrawn successfully.",
      status: true
    });
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({
      message: "Server error while withdrawing application.",
      status: false
    });
  }
};

// Get application statistics (admin only)
const getApplicationStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const reviewedApplications = await Application.countDocuments({ status: 'reviewed' });
    const interviewedApplications = await Application.countDocuments({ status: 'interviewed' });
    const offeredApplications = await Application.countDocuments({ status: 'offered' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

    // Applications by status
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentApplications = await Application.countDocuments({
      appliedDate: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      status: true,
      stats: {
        totalApplications,
        pendingApplications,
        reviewedApplications,
        interviewedApplications,
        offeredApplications,
        rejectedApplications,
        recentApplications,
        applicationsByStatus
      }
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      message: "Server error while fetching application statistics.",
      status: false
    });
  }
};

module.exports = {
  applyForJob,
  getJobApplications,
  getApplicantApplications,
  updateApplicationStatus,
  getApplicationById,
  withdrawApplication,
  getApplicationStats
};
