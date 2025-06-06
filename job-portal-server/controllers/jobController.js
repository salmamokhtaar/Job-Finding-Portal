const Job = require('../models/Job');
const Application = require('../models/Application');
const mongoose = require('mongoose');

// Create a new job (company or admin)
const createJob = async (req, res) => {
  try {
    const jobData = req.body;
<<<<<<< HEAD

    // Add the company user ID as the poster
    jobData.postedBy = req.user._id;

=======
    const userRole = req.user.role;

    // Add the user ID as the poster
    jobData.postedBy = req.user._id;

    // If the user is an admin, automatically approve the job
    if (userRole === 'admin') {
      jobData.approvalStatus = 'approved';
    } else {
      // For company users, set to pending by default
      jobData.approvalStatus = 'pending';
    }

>>>>>>> 3e55399fd15e9a63459b96bd40a32ea305e3bfae
    // Create new job
    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      message: "Job posted successfully.",
      status: true,
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      message: "Server error while creating job.",
      status: false
    });
  }
};

// Get all jobs with filters
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      employmentType,
      experienceLevel,
      salaryMin,
      salaryMax,
      skills,
      status = 'active'
    } = req.query;

    // Build query
<<<<<<< HEAD
    const query = { status };
=======
    const query = {
      status,
      approvalStatus: 'approved' // Only show approved jobs to the public
    };
>>>>>>> 3e55399fd15e9a63459b96bd40a32ea305e3bfae

    // Search by title or company
    if (search) {
      query.$or = [
        { jobTitle: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by location
    if (location) {
      query.jobLocation = { $regex: location, $options: 'i' };
    }

    // Filter by employment type
    if (employmentType) {
      query.employmentType = employmentType;
    }

    // Filter by experience level
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Filter by salary range
    if (salaryMin || salaryMax) {
      query.maxSalary = {};
      if (salaryMin) query.maxSalary.$gte = Number(salaryMin);
      if (salaryMax) query.maxSalary.$lte = Number(salaryMax);
    }

    // Filter by skills
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }

    // Execute query with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const jobs = await Job.find(query)
      .sort({ postingDate: -1 })
      .skip(skip)
      .limit(limit)
      .populate('postedBy', 'username email companyProfile.companyName companyProfile.companyLogo');

    // Get total count for pagination
    const total = await Job.countDocuments(query);

    res.status(200).json({
      status: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      jobs
    });
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({
      message: "Server error while fetching jobs.",
      status: false
    });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

    const job = await Job.findById(id)
      .populate('postedBy', 'username email companyProfile.companyName companyProfile.companyLogo');

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

    res.status(200).json({
      status: true,
      job
    });
  } catch (error) {
    console.error('Get job by ID error:', error);
    res.status(500).json({
      message: "Server error while fetching job.",
      status: false
    });
  }
};

// Get jobs posted by company
const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user._id;

    const jobs = await Job.find({ postedBy: companyId })
      .sort({ postingDate: -1 });

    res.status(200).json({
      status: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({
      message: "Server error while fetching company jobs.",
      status: false
    });
  }
};

// Update job (company only)
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const companyId = req.user._id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

    // Find job and check ownership
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

    // Check if the user is the job poster
    if (job.postedBy.toString() !== companyId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only update your own job postings.",
        status: false
      });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { $set: { ...updates, updatedAt: Date.now() } },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Job updated successfully.",
      status: true,
      job: updatedJob
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({
      message: "Server error while updating job.",
      status: false
    });
  }
};

// Delete job (company or admin)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

    // Find job
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

    // Check if user is authorized to delete (company owner or admin)
    if (userRole !== 'admin' && job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only delete your own job postings.",
        status: false
      });
    }

    // Delete job and related applications
    await Job.findByIdAndDelete(id);
    await Application.deleteMany({ job: id });

    res.status(200).json({
      message: "Job deleted successfully.",
      status: true
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      message: "Server error while deleting job.",
      status: false
    });
  }
};

// Get job statistics (admin only)
const getJobStats = async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const closedJobs = await Job.countDocuments({ status: 'closed' });
    const draftJobs = await Job.countDocuments({ status: 'draft' });

    // Jobs by employment type
    const jobsByType = await Job.aggregate([
      { $group: { _id: '$employmentType', count: { $sum: 1 } } }
    ]);

    // Jobs by experience level
    const jobsByExperience = await Job.aggregate([
      { $group: { _id: '$experienceLevel', count: { $sum: 1 } } }
    ]);

    // Recent jobs (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentJobs = await Job.countDocuments({
      postingDate: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      status: true,
      stats: {
        totalJobs,
        activeJobs,
        closedJobs,
        draftJobs,
        recentJobs,
        jobsByType,
        jobsByExperience
      }
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      message: "Server error while fetching job statistics.",
      status: false
    });
  }
};

// Toggle job status (company/admin)
const toggleJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

    // Validate status
    if (!['active', 'closed', 'draft'].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'active', 'closed', or 'draft'.",
        status: false
      });
    }

    // Find job
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

    // Check authorization
    if (userRole !== 'admin' && job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only modify your own job postings.",
        status: false
      });
    }

    // Update status
    job.status = status;
    job.updatedAt = Date.now();
    await job.save();

    res.status(200).json({
      message: `Job status updated to ${status}.`,
      status: true,
      job
    });
  } catch (error) {
    console.error('Toggle job status error:', error);
    res.status(500).json({
      message: "Server error while updating job status.",
      status: false
    });
  }
};

// Get job applications (company/admin)
const getJobApplications = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

    // Find job
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

    // Check authorization
    if (userRole !== 'admin' && job.postedBy.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Access denied. You can only view applications for your own job postings.",
        status: false
      });
    }

    // Get applications
    const applications = await Application.find({ job: id })
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
      message: "Server error while fetching job applications.",
      status: false
    });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getCompanyJobs,
  updateJob,
  deleteJob,
  getJobStats,
  toggleJobStatus,
  getJobApplications
};
