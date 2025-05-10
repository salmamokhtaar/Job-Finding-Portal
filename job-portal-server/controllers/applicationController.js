const Application = require('../models/Application');
const Job = require('../models/Job');
const mongoose = require('mongoose');

// Apply for a job (applicant only)
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resume, coverLetter } = req.body;
    const applicantId = req.user._id;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }
    
    // Check if resume is provided
    if (!resume) {
      return res.status(400).json({
        message: "Resume is required for job application.",
        status: false
      });
    }
    
    // Find job
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }
    
    // Check if job is active
    if (job.status !== 'active') {
      return res.status(400).json({
        message: "This job is no longer accepting applications.",
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
      resume,
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
          resume,
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

module.exports = {
  applyForJob,
  getJobApplications,
  getApplicantApplications,
  updateApplicationStatus
};
