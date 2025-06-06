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

// Get user statistics (admin only)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const pendingUsers = await User.countDocuments({ status: 'pending' });

    // Users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      status: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        pendingUsers,
        recentUsers,
        usersByRole
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: "Server error while fetching user statistics.",
      status: false
    });
  }
};

// Toggle user status (admin only)
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid user ID format.",
        status: false
      });
    }

    // Validate status
    if (!['active', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'active', 'inactive', or 'pending'.",
        status: false
      });
    }

    // Update user status
    const user = await User.findByIdAndUpdate(
      id,
      { $set: { status, updatedAt: Date.now() } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: false
      });
    }

    res.status(200).json({
      message: `User status updated to ${status}.`,
      status: true,
      user
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    res.status(500).json({
      message: "Server error while updating user status.",
      status: false
    });
  }
};

// Change password (authenticated user)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required.",
        status: false
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters long.",
        status: false
      });
    }

    // Find user with password
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: false
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect.",
        status: false
      });
    }

    // Update password
    user.password = newPassword;
    user.updatedAt = Date.now();
    await user.save();

    res.status(200).json({
      message: "Password changed successfully.",
      status: true
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      message: "Server error while changing password.",
      status: false
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUser,
  deleteUser,
  getUserStats,
  toggleUserStatus,
  changePassword
};
