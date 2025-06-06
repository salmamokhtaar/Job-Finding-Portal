const User = require('../models/User');
const Application = require('../models/Application');
const mongoose = require('mongoose');

// Get applicant profile
const getApplicantProfile = async (req, res) => {
  try {
    const applicantId = req.user._id;
    
    const applicant = await User.findById(applicantId)
      .select('-password');
    
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found.",
        status: false
      });
    }
    
    res.status(200).json({
      status: true,
      applicant
    });
  } catch (error) {
    console.error('Get applicant profile error:', error);
    res.status(500).json({
      message: "Server error while fetching applicant profile.",
      status: false
    });
  }
};

// Update applicant profile (username only)
const updateApplicantProfile = async (req, res) => {
  try {
    const applicantId = req.user._id;
    const { username } = req.body;
    
    // Validate required fields
    if (!username) {
      return res.status(400).json({
        message: "Username is required.",
        status: false
      });
    }
    
    // Update applicant profile
    const applicant = await User.findByIdAndUpdate(
      applicantId,
      { $set: { username } },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!applicant) {
      return res.status(404).json({
        message: "Applicant not found.",
        status: false
      });
    }
    
    res.status(200).json({
      message: "Applicant profile updated successfully.",
      status: true,
      applicant
    });
  } catch (error) {
    console.error('Update applicant profile error:', error);
    res.status(500).json({
      message: "Server error while updating applicant profile.",
      status: false
    });
  }
};

// Get applicant dashboard stats
const getApplicantStats = async (req, res) => {
  try {
    const applicantId = req.user._id;
    
    // Get counts
    const totalApplications = await Application.countDocuments({ 
      applicant: applicantId 
    });
    
    const pendingApplications = await Application.countDocuments({ 
      applicant: applicantId,
      status: 'pending'
    });
    
    const reviewedApplications = await Application.countDocuments({ 
      applicant: applicantId,
      status: { $in: ['reviewed', 'interviewed', 'offered'] }
    });
    
    const rejectedApplications = await Application.countDocuments({ 
      applicant: applicantId,
      status: 'rejected'
    });
    
    // Get recent applications
    const recentApplications = await Application.find({ applicant: applicantId })
      .sort({ appliedDate: -1 })
      .limit(5)
      .populate('job', 'jobTitle companyName jobLocation')
      .populate('company', 'username companyProfile.companyName');
    
    res.status(200).json({
      status: true,
      stats: {
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          reviewed: reviewedApplications,
          rejected: rejectedApplications
        }
      },
      recentApplications
    });
  } catch (error) {
    console.error('Get applicant stats error:', error);
    res.status(500).json({
      message: "Server error while fetching applicant statistics.",
      status: false
    });
  }
};

module.exports = {
  getApplicantProfile,
  updateApplicantProfile,
  getApplicantStats
};
