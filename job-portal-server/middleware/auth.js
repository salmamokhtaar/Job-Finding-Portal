const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access denied. No valid token provided.',
        status: false
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and exclude password
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        message: 'Invalid token. User not found.',
        status: false
      });
    }

    // Check if user account is active
    if (user.status === 'inactive') {
      return res.status(401).json({
        message: 'Account is inactive. Please contact administrator.',
        status: false
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: 'Invalid token format.',
        status: false
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: 'Token has expired. Please login again.',
        status: false
      });
    }

    res.status(500).json({
      message: 'Authentication failed.',
      status: false
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Access denied. User not authenticated.',
        status: false
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
        status: false
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or is admin
const authorizeOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Access denied. User not authenticated.',
      status: false
    });
  }

  const resourceUserId = req.params.userId || req.body.userId;
  const isOwner = req.user._id.toString() === resourceUserId;
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      message: 'Access denied. You can only access your own resources.',
      status: false
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizeOwnerOrAdmin
};
