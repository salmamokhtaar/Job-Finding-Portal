const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get company's jobs with approval status
const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user._id;
    
    const jobs = await Job.find({ postedBy: companyId })
      .sort({ createdAt: -1 });
    
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

// Get company profile
const getCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user._id;
    
    const company = await User.findById(companyId)
      .select('-password');
    
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        status: false
      });
    }
    
    res.status(200).json({
      status: true,
      company
    });
  } catch (error) {
    console.error('Get company profile error:', error);
    res.status(500).json({
      message: "Server error while fetching company profile.",
      status: false
    });
  }
};

// Update company profile
const updateCompanyProfile = async (req, res) => {
  try {
    const companyId = req.user._id;
    const { 
      username, 
      companyProfile 
    } = req.body;
    
    // Validate required fields
    if (!username) {
      return res.status(400).json({
        message: "Username is required.",
        status: false
      });
    }
    
    // Update company profile
    const company = await User.findByIdAndUpdate(
      companyId,
      { 
        $set: { 
          username,
          companyProfile: companyProfile || {}
        } 
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        status: false
      });
    }
    
    res.status(200).json({
      message: "Company profile updated successfully.",
      status: true,
      company
    });
  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({
      message: "Server error while updating company profile.",
      status: false
    });
  }
};

// Get company dashboard stats
const getCompanyStats = async (req, res) => {
  try {
    const companyId = req.user._id;
    
    // Get counts
    const totalJobs = await Job.countDocuments({ postedBy: companyId });
    const pendingJobs = await Job.countDocuments({ 
      postedBy: companyId,
      approvalStatus: 'pending'
    });
    const approvedJobs = await Job.countDocuments({ 
      postedBy: companyId,
      approvalStatus: 'approved'
    });
    const rejectedJobs = await Job.countDocuments({ 
      postedBy: companyId,
      approvalStatus: 'rejected'
    });
    
    const totalApplications = await Application.countDocuments({ 
      company: companyId 
    });
    
    // Get recent applications
    const recentApplications = await Application.find({ company: companyId })
      .sort({ appliedDate: -1 })
      .limit(5)
      .populate('job', 'jobTitle')
      .populate('applicant', 'username');
    
    res.status(200).json({
      status: true,
      stats: {
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
      recentApplications
    });
  } catch (error) {
    console.error('Get company stats error:', error);
    res.status(500).json({
      message: "Server error while fetching company statistics.",
      status: false
    });
  }
};

module.exports = {
  getCompanyJobs,
  getCompanyProfile,
  updateCompanyProfile,
  getCompanyStats
};
