const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const mongoose = require('mongoose');

// Debug imports
console.log('User model imported:', !!User);
console.log('Job model imported:', !!Job);
console.log('Application model imported:', !!Application);

// Get all jobs with approval status for admin
const getAllJobsAdmin = async (req, res) => {
  try {
    console.log("Admin requesting all jobs");

    // Get all jobs, regardless of approval status
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'username email companyProfile.companyName');

    console.log(`Found ${jobs.length} jobs`);

    res.status(200).json({
      status: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    console.error('Get all jobs admin error:', error);
    res.status(500).json({
      message: "Server error while fetching jobs.",
      status: false
    });
  }
};

// Approve or reject a job
const updateJobApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { approvalStatus, rejectionReason } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid job ID format.",
        status: false
      });
    }

    // Validate approval status
    if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
      return res.status(400).json({
        message: "Invalid approval status. Must be one of: pending, approved, rejected",
        status: false
      });
    }

    // If rejecting, require a reason
    if (approvalStatus === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        message: "Rejection reason is required when rejecting a job.",
        status: false
      });
    }

    // Update job approval status
    const updateData = { approvalStatus };
    if (approvalStatus === 'rejected') {
      updateData.rejectionReason = rejectionReason;
    } else {
      updateData.rejectionReason = '';
    }

    const job = await Job.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).populate('postedBy', 'username email companyProfile.companyName');

    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        status: false
      });
    }

    res.status(200).json({
      message: `Job ${approvalStatus === 'approved' ? 'approved' : 'rejected'} successfully.`,
      status: true,
      job
    });
  } catch (error) {
    console.error('Update job approval error:', error);
    res.status(500).json({
      message: "Server error while updating job approval status.",
      status: false
    });
  }
};

// Get system statistics for admin dashboard
const getSystemStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const companyUsers = await User.countDocuments({ role: 'company' });
    const applicantUsers = await User.countDocuments({ role: 'applicant' });

    const totalJobs = await Job.countDocuments();
    const pendingJobs = await Job.countDocuments({ approvalStatus: 'pending' });
    const approvedJobs = await Job.countDocuments({ approvalStatus: 'approved' });
    const rejectedJobs = await Job.countDocuments({ approvalStatus: 'rejected' });

    const totalApplications = await Application.countDocuments();

    // Get recent activity
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('postedBy', 'username companyProfile.companyName');

    const recentApplications = await Application.find()
      .sort({ appliedDate: -1 })
      .limit(5)
      .populate('job', 'jobTitle')
      .populate('applicant', 'username');

    res.status(200).json({
      status: true,
      stats: {
        users: {
          total: totalUsers,
          admins: adminUsers,
          companies: companyUsers,
          applicants: applicantUsers
        },
        jobs: {
          total: totalJobs,
          pending: pendingJobs,
          approved: approvedJobs,
          rejected: rejectedJobs
        },
        applications: {
          total: totalApplications
        }
      },
      recentActivity: {
        jobs: recentJobs,
        applications: recentApplications
      }
    });
  } catch (error) {
    console.error('Get system stats error:', error);
    res.status(500).json({
      message: "Server error while fetching system statistics.",
      status: false
    });
  }
};

// Create a new user (admin only)
const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "Username, email, password, and role are required.",
        status: false
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists.",
        status: false
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully.",
      status: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      message: "Server error while creating user.",
      status: false
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      message: "Server error while fetching users.",
      status: false
    });
  }
};

module.exports = {
  getAllJobsAdmin,
  updateJobApproval,
  getSystemStats,
  createUser,
  getAllUsers
};
