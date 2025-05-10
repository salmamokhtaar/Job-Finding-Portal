const User = require('../models/User');
const { generateToken } = require('../utils/jwtUtils');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, and password are required.",
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

    // Create new user with role
    const user = new User({
      username,
      email,
      password,
      role: role || 'applicant' // Default to applicant if no role provided
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Return success response with token
    res.status(201).json({
      message: "User registered successfully.",
      status: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: "Server error during registration.",
      status: false
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        status: false
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials.",
        status: false
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials.",
        status: false
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return success response with token
    res.status(200).json({
      message: "Login successful.",
      status: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: "Server error during login.",
      status: false
    });
  }
};

// Get current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    
    res.status(200).json({
      status: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        applicantProfile: user.applicantProfile,
        companyProfile: user.companyProfile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      message: "Server error while fetching user profile.",
      status: false
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser
};
