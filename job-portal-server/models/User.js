const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['applicant', 'company', 'admin'],
    default: 'applicant'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  // Fields for applicant profile
  applicantProfile: {
    fullName: String,
    phone: String,
    address: String,
    education: [{
      institution: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }],
    experience: [{
      company: String,
      position: String,
      description: String,
      startDate: Date,
      endDate: Date,
      current: Boolean
    }],
    skills: [String],
    resume: String // URL to resume file
  },
  // Fields for company profile
  companyProfile: {
    companyName: String,
    companyLogo: String,
    companyWebsite: String,
    companySize: String,
    industry: String,
    founded: Number,
    description: String,
    location: String
  },
  // Common fields
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified or new
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
