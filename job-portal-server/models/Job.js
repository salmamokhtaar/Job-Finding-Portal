const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  companyLogo: {
    type: String,
    default: ''
  },
  minSalary: {
    type: Number,
    required: true
  },
  maxSalary: {
    type: Number,
    required: true
  },
  salaryType: {
    type: String,
    enum: ['hourly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  jobLocation: {
    type: String,
    required: true
  },
  postingDate: {
    type: Date,
    default: Date.now
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'intermediate', 'senior', 'executive'],
    required: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interviewed', 'offered', 'rejected'],
      default: 'pending'
    },
    appliedDate: {
      type: Date,
      default: Date.now
    },
    resume: String,
    coverLetter: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Job = mongoose.model('Job', JobSchema);

module.exports = Job;
