import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaBriefcase, FaFileAlt, FaSearch, FaSignOutAlt } from 'react-icons/fa';

const ApplicantDashboard = () => {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'applicant') {
      navigate('/login');
      return;
    }

    setUser(userData);

    // Fetch applicant data
    const fetchApplicantData = async () => {
      try {
        setIsLoading(true);

        // Try to use the new API endpoint first for stats
        try {
          const statsResponse = await axios.get('http://localhost:5000/api/applicant/stats', {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          });

          if (statsResponse.data.status) {
            // Set applications from stats response
            if (statsResponse.data.recentApplications) {
              setApplications(statsResponse.data.recentApplications);
            }

            // Fetch recent jobs
            const jobsResponse = await axios.get('http://localhost:5000/api/jobs?limit=5');

            if (jobsResponse.data.status) {
              setRecentJobs(jobsResponse.data.jobs);
              setIsLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.log('New API error:', apiError);
          // Fall back to legacy API
        }

        // Fallback to legacy APIs
        try {
          // Try to get applications
          const applicationsResponse = await axios.get('http://localhost:5000/api/applications/my-applications', {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          });

          if (applicationsResponse.data.status) {
            setApplications(applicationsResponse.data.applications);
          }

          // Get recent jobs
          const jobsResponse = await axios.get('http://localhost:5000/all-jobs');
          setRecentJobs(jobsResponse.data.slice(0, 5));
        } catch (error) {
          console.error('Error fetching legacy data:', error);
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in fetchApplicantData:', error);
        setIsLoading(false);
      }
    };

    fetchApplicantData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">Job Seeker</h1>
          <p className="text-gray-600 mt-1">{user?.username}</p>
        </div>
        <nav className="mt-6">
          <div className="px-6 py-4">
            <Link to="/applicant-dashboard" className="flex items-center px-4 py-3 text-gray-700 bg-gray-100 rounded-md">
              <FaUser className="mr-3 text-blue-600" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <Link to="/" className="flex items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100">
              <FaSearch className="mr-3 text-blue-600" />
              <span className="font-medium">Find Jobs</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <Link to="/my-applications" className="flex items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100">
              <FaFileAlt className="mr-3 text-blue-600" />
              <span className="font-medium">My Applications</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <Link to="/profile" className="flex items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100">
              <FaUser className="mr-3 text-blue-600" />
              <span className="font-medium">My Profile</span>
            </Link>
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100"
            >
              <FaSignOutAlt className="mr-3 text-blue-600" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome, {user?.username}!</h3>
            <p className="text-gray-600">
              Find your dream job and track your applications all in one place.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-4">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-blue-100 rounded-full">
                  <FaBriefcase className="text-2xl text-blue-600" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-700">{applications.length}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-gray-700">
                    {applications.filter(app => app.status === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Reviewed</p>
                  <p className="text-3xl font-bold text-gray-700">
                    {applications.filter(app => ['reviewed', 'interviewed', 'offered'].includes(app.status)).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Rejected</p>
                  <p className="text-3xl font-bold text-gray-700">
                    {applications.filter(app => app.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Recent Applications</h3>
            <div className="bg-white rounded-lg shadow-md">
              {applications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {applications.slice(0, 3).map((application, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="p-2 mr-4 bg-blue-100 rounded-full">
                          <FaBriefcase className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            {application.job?.jobTitle || 'Job Title'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: <span className={`font-medium px-2 py-1 rounded-full text-xs
                              ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-green-100 text-green-800'}`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied: {new Date(application.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  You haven't applied to any jobs yet.
                </div>
              )}
              {applications.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <Link to="/my-applications" className="text-blue-600 hover:underline">
                    View all applications
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Jobs */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Recent Job Postings</h3>
            <div className="bg-white rounded-lg shadow-md">
              {recentJobs.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {recentJobs.filter(job => job.approvalStatus === 'approved').map((job, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="p-2 mr-4 bg-blue-100 rounded-full">
                          <FaBriefcase className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            {job.jobTitle}
                          </p>
                          <p className="text-sm text-gray-500">
                            {job.companyName} • {job.jobLocation}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${job.minPrice || job.minSalary || 0} - ${job.maxPrice || job.maxSalary || 0} • {job.employmentType}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No jobs available at the moment.
                </div>
              )}
              <div className="p-4 border-t border-gray-200">
                <Link to="/" className="text-blue-600 hover:underline">
                  Browse all jobs
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApplicantDashboard;
