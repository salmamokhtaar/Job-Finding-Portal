const User = require('../models/User');
const mongoose = require('mongoose');

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
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

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format.",
        status: false
      });
    }

    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: false
      });
    }

    res.status(200).json({
      status: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      message: "Server error while fetching user.",
      status: false
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;
    
    // Prevent role change through this endpoint
    if (updates.role) {
      delete updates.role;
    }

    // Prevent password change through this endpoint
    if (updates.password) {
      delete updates.password;
    }

    // Update based on user role
    let updateData = {};
    
    if (req.user.role === 'applicant') {
      updateData = { 
        username: updates.username,
        applicantProfile: updates.applicantProfile,
        updatedAt: Date.now()
      };
    } else if (req.user.role === 'company') {
      updateData = { 
        username: updates.username,
        companyProfile: updates.companyProfile,
        updatedAt: Date.now()
      };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: false
      });
    }

    res.status(200).json({
      message: "Profile updated successfully.",
      status: true,
      user
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      message: "Server error while updating profile.",
      status: false
    });
  }
};

// Update user (admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format.",
        status: false
      });
    }

    // If password is being updated, hash it
    if (updates.password) {
      const user = new User({ password: updates.password });
      await user.save(); // This will trigger the pre-save hook to hash the password
      updates.password = user.password;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: { ...updates, updatedAt: Date.now() } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: false
      });
    }

    res.status(200).json({
      message: "User updated successfully.",
      status: true,
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: "Server error while updating user.",
      status: false
    });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format.",
        status: false
      });
    }

    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: false
      });
    }

    res.status(200).json({
      message: "User deleted successfully.",
      status: true
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: "Server error while deleting user.",
      status: false
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUser,
  deleteUser
};
