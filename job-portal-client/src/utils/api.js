import axios from 'axios';

// Base URLs
const API_BASE_URL = 'http://localhost:5000/api';
const LEGACY_BASE_URL = 'http://localhost:5000';

// Create axios instances
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const legacyApi = axios.create({
  baseURL: LEGACY_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Authentication API calls
export const authAPI = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.post('/user/register', userData);
        return legacyResponse.data;
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.post('/user/login', credentials);
        return legacyResponse.data;
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Jobs API calls
export const jobsAPI = {
  // Get all jobs with filters
  getAllJobs: async (filters = {}) => {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.get('/all-jobs');
        return { status: true, jobs: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Get job by ID
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.get(`/all-jobs/${jobId}`);
        return { status: true, job: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Get company's jobs
  getCompanyJobs: async () => {
    try {
      const response = await api.get('/jobs/company/myjobs');
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        try {
          const legacyResponse = await legacyApi.get(`/myJobs/${user.email}`);
          return { status: true, jobs: legacyResponse.data };
        } catch (legacyError) {
          throw legacyError;
        }
      }
      throw error;
    }
  },

  // Create a new job
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.post('/post-job', jobData);
        return { status: true, job: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Update job
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.patch(`/update-job/${jobId}`, jobData);
        return { status: true, job: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Delete job
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.delete(`/job/${jobId}`);
        return { status: true, result: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },
};

// Applications API calls
export const applicationsAPI = {
  // Apply for a job
  applyForJob: async (jobId, applicationData) => {
    try {
      const response = await api.post(`/applications/jobs/${jobId}/apply`, applicationData);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.post(`/user/Applicant`, { email: applicationData.email });
        return { status: true, result: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Get applicant's applications
  getApplicantApplications: async () => {
    try {
      const response = await api.get('/applications/my-applications');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get applications for a job
  getJobApplications: async (jobId) => {
    try {
      const response = await api.get(`/applications/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/applications/${applicationId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Users API calls
export const usersAPI = {
  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.get('/get-user');
        return { status: true, users: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.get(`/single/user/${userId}`);
        return { status: true, user: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user (admin only)
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.put(`/user/update/${userId}`, userData);
        return { status: true, user: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },

  // Delete user (admin only)
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      // Fallback to legacy API
      try {
        const legacyResponse = await legacyApi.delete(`/user/${userId}`);
        return { status: true, result: legacyResponse.data };
      } catch (legacyError) {
        throw legacyError;
      }
    }
  },
};

export default {
  auth: authAPI,
  jobs: jobsAPI,
  applications: applicationsAPI,
  users: usersAPI,
};
