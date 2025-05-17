import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaBuilding, FaBriefcase, FaUserTie, FaPlus, FaSignOutAlt } from 'react-icons/fa';

const CompanyDashboard = () => {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || userData.role !== 'company') {
      navigate('/login');
      return;
    }

    setUser(userData);

    // Fetch company's jobs and stats
    const fetchCompanyData = async () => {
      try {
        setIsLoading(true);

        // Try to use the new API endpoint first
        try {
          // Get company stats
          const statsResponse = await axios.get('http://localhost:5000/api/company/stats', {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          });

          if (statsResponse.data.status) {
            // Get company jobs
            const jobsResponse = await axios.get('http://localhost:5000/api/company/jobs', {
              headers: {
                Authorization: `Bearer ${userData.token}`
              }
            });

            if (jobsResponse.data.status) {
              setJobs(jobsResponse.data.jobs);

              // Set applicants from stats response
              if (statsResponse.data.recentApplications) {
                setApplicants(statsResponse.data.recentApplications);
              }

              setIsLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.log('New API error:', apiError);
          // Fall back to legacy API
        }

        // Fallback to legacy API
        try {
          // Get jobs
          const legacyResponse = await axios.get(`http://localhost:5000/myJobs/${userData.email}`);

          // Add default approval status for legacy API
          const jobsWithApproval = legacyResponse.data.map(job => ({
            ...job,
            approvalStatus: job.approvalStatus || 'approved'
          }));

          setJobs(jobsWithApproval);

          // Try to get applicants for each job
          let allApplicants = [];
          for (const job of legacyResponse.data) {
            try {
              const applicantsResponse = await axios.get(`http://localhost:5000/api/applications/jobs/${job._id}`, {
                headers: {
                  Authorization: `Bearer ${userData.token}`
                }
              });

              if (applicantsResponse.data.status) {
                allApplicants = [...allApplicants, ...applicantsResponse.data.applications];
              }
            } catch (error) {
              console.error(`Error fetching applicants for job ${job._id}:`, error);
            }
          }

          setApplicants(allApplicants);
        } catch (err) {
          console.error('Error fetching legacy jobs:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
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
          <h1 className="text-2xl font-bold text-blue-600">Company Portal</h1>
          <p className="text-gray-600 mt-1">{user?.username}</p>
        </div>
        <nav className="mt-6">
          <div className="px-6 py-4">
            <Link to="/company-dashboard" className="flex items-center px-4 py-3 text-gray-700 bg-gray-100 rounded-md">
              <FaBuilding className="mr-3 text-blue-600" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <Link to="/post-job" className="flex items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100">
              <FaPlus className="mr-3 text-blue-600" />
              <span className="font-medium">Post Job</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <Link to="/manage-jobs" className="flex items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100">
              <FaBriefcase className="mr-3 text-blue-600" />
              <span className="font-medium">Manage Jobs</span>
            </Link>
          </div>
          <div className="px-6 py-4">
            <Link to="/company-profile" className="flex items-center px-4 py-3 text-gray-600 rounded-md hover:bg-gray-100">
              <FaBuilding className="mr-3 text-blue-600" />
              <span className="font-medium">Company Profile</span>
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
            <h2 className="text-xl font-semibold text-gray-800">Company Dashboard</h2>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Welcome, {user?.username}!</h3>
            <p className="text-gray-600">
              Manage your job postings and review applicants all in one place.
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
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-700">{jobs.length}</p>
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
                  <p className="mb-2 text-sm font-medium text-gray-600">Pending Approval</p>
                  <p className="text-3xl font-bold text-gray-700">
                    {jobs.filter(job => job.approvalStatus === 'pending').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Approved Jobs</p>
                  <p className="text-3xl font-bold text-gray-700">
                    {jobs.filter(job => job.approvalStatus === 'approved').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center">
                <div className="p-3 mr-4 bg-green-100 rounded-full">
                  <FaUserTie className="text-2xl text-green-600" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-gray-600">Total Applicants</p>
                  <p className="text-3xl font-bold text-gray-700">{applicants.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="mb-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Your Job Postings</h3>
            <div className="bg-white rounded-lg shadow-md">
              {jobs.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {jobs.slice(0, 3).map((job, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="p-2 mr-4 bg-blue-100 rounded-full">
                          <FaBriefcase className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <p className="font-medium text-gray-700">
                              {job.jobTitle}
                            </p>
                            <div className={`ml-2 px-2 py-1 text-xs rounded-full
                              ${job.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                job.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'}`}
                            >
                              {job.approvalStatus === 'approved' ? 'Approved' :
                               job.approvalStatus === 'rejected' ? 'Rejected' : 'Pending'}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            Location: {job.jobLocation} • Type: {job.employmentType}
                          </p>
                          <p className="text-sm text-gray-500">
                            Posted: {new Date(job.postingDate || job.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                          {job.approvalStatus === 'rejected' && job.rejectionReason && (
                            <p className="text-sm text-red-500 mt-1">
                              Rejection reason: {job.rejectionReason}
                            </p>
                          )}
                        </div>
                        <div>
                          <Link
                            to={`/edit-job/${job._id}`}
                            className="px-3 py-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  You haven't posted any jobs yet.
                </div>
              )}
              {jobs.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <Link to="/manage-jobs" className="text-blue-600 hover:underline">
                    View all jobs
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Applicants */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-700">Recent Applicants</h3>
            <div className="bg-white rounded-lg shadow-md">
              {applicants.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {applicants.slice(0, 3).map((applicant, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="p-2 mr-4 bg-green-100 rounded-full">
                          <FaUserTie className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">
                            {applicant.applicant?.username || 'Applicant'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied for: {applicant.job?.jobTitle || 'Job Position'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: <span className="font-medium capitalize">{applicant.status}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No applicants yet.
                </div>
              )}
              {applicants.length > 0 && (
                <div className="p-4 border-t border-gray-200">
                  <Link to="/manage-jobs" className="text-blue-600 hover:underline">
                    View all applicants
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
