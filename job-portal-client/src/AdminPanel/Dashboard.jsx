import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SideNav from './SideNav'
import { FaBriefcase, FaUsers, FaUserTie, FaChartLine } from 'react-icons/fa'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalUsers: 0,
    totalApplicants: 0,
    activeJobs: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentJobs, setRecentJobs] = useState([])
  const [recentUsers, setRecentUsers] = useState([])

  const [jobsByCategory, setJobsByCategory] = useState([])
  const [applicationStatus, setApplicationStatus] = useState([])
  const [jobsByLocation, setJobsByLocation] = useState([])
  const [usersByRole, setUsersByRole] = useState([])

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Fetch jobs count
        const jobsResponse = await axios.get('http://localhost:5000/all-jobs')

        // Fetch users
        const usersResponse = await axios.get('http://localhost:5000/get-user')

        // Fetch applicants
        const applicantsResponse = await axios.get('http://localhost:5000/get/applicants')

        // Calculate stats
        const activeJobs = jobsResponse.data.filter(job => job.status !== 'closed').length

        setStats({
          totalJobs: jobsResponse.data.length,
          totalUsers: usersResponse.data.length,
          totalApplicants: applicantsResponse.data.length,
          activeJobs: activeJobs
        })

        // Get recent jobs (last 5)
        setRecentJobs(jobsResponse.data.slice(0, 5))

        // Get recent users (last 5)
        setRecentUsers(usersResponse.data.slice(0, 5))

        // Process data for charts
        processChartData(jobsResponse.data, usersResponse.data, applicantsResponse.data)

        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const processChartData = (jobs, users, applicants) => {
    // Jobs by category (employment type)
    const jobCategories = {}
    jobs.forEach(job => {
      const category = job.employmentType || 'Other'
      jobCategories[category] = (jobCategories[category] || 0) + 1
    })

    const jobsByCategoryData = Object.keys(jobCategories).map(key => ({
      name: formatCategoryName(key),
      value: jobCategories[key]
    }))
    setJobsByCategory(jobsByCategoryData)

    // Application status
    const statusCount = {
      'pending': 0,
      'reviewed': 0,
      'interviewed': 0,
      'offered': 0,
      'rejected': 0
    }

    applicants.forEach(app => {
      const status = app.status || 'pending'
      statusCount[status] = (statusCount[status] || 0) + 1
    })

    const applicationStatusData = Object.keys(statusCount).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: statusCount[key]
    }))
    setApplicationStatus(applicationStatusData)

    // Jobs by location
    const locations = {}
    jobs.forEach(job => {
      const location = job.jobLocation || 'Unknown'
      locations[location] = (locations[location] || 0) + 1
    })

    const topLocations = Object.keys(locations)
      .sort((a, b) => locations[b] - locations[a])
      .slice(0, 5)

    const jobsByLocationData = topLocations.map(location => ({
      name: location,
      jobs: locations[location]
    }))
    setJobsByLocation(jobsByLocationData)

    // Users by role
    const roles = {
      'admin': 0,
      'company': 0,
      'applicant': 0
    }

    users.forEach(user => {
      const role = user.role || 'applicant'
      roles[role] = (roles[role] || 0) + 1
    })

    const usersByRoleData = Object.keys(roles).map(key => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: roles[key]
    }))
    setUsersByRole(usersByRoleData)
  }

  const formatCategoryName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[20%] w-[80%] p-8 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 opacity-90">Welcome to your job portal management dashboard</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-blue-500 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-4 rounded-full bg-blue-100 mr-4">
                    <FaBriefcase className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalJobs}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <Link to="/admin/jobs" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                    View all jobs <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-green-500 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-4 rounded-full bg-green-100 mr-4">
                    <FaUsers className="text-green-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <Link to="/admin/users" className="text-green-600 hover:text-green-800 font-medium flex items-center">
                    View all users <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-purple-500 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-4 rounded-full bg-purple-100 mr-4">
                    <FaUserTie className="text-purple-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Applicants</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.totalApplicants}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <Link to="/Applicants" className="text-purple-600 hover:text-purple-800 font-medium flex items-center">
                    View all applicants <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border-b-4 border-yellow-500 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center">
                  <div className="p-4 rounded-full bg-yellow-100 mr-4">
                    <FaChartLine className="text-yellow-600 text-2xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Active Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-800">{stats.activeJobs}</h3>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <Link to="/admin/jobs" className="text-yellow-600 hover:text-yellow-800 font-medium flex items-center">
                    View active jobs <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Jobs by Category Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Jobs by Category</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {jobsByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} jobs`, 'Count']} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Users by Role Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Users by Role</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByRole}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {usersByRole.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Jobs by Location Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Top Job Locations</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobsByLocation}
                      margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                      <Legend />
                      <Bar dataKey="jobs" fill="#4f46e5" name="Jobs" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Application Status Chart */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Application Status</h2>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={applicationStatus}
                      margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} />
                      <Legend />
                      <Bar dataKey="value" fill="#10b981" name="Applications" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Jobs and Users Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Jobs */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Job Posts</h2>
                  <Link
                    to="/admin/jobs"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    View All <span className="ml-1">→</span>
                  </Link>
                </div>

                {recentJobs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No jobs found. Create your first job posting!</p>
                    <Link
                      to="/admin/create-job"
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create Job
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-lg">Job Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Company</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Location</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-lg">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentJobs.map((job) => (
                            <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                                <div className="text-xs text-gray-500">${job.minSalary} - ${job.maxSalary}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-700">{job.companyName}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-700">{job.jobLocation}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <Link
                                    to={`/admin/edit-job/${job._id}`}
                                    className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded"
                                    title="Edit"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </Link>
                                  <Link
                                    to={`/job/${job._id}`}
                                    className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"
                                    title="View"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Users */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h2 className="text-xl font-semibold text-gray-800">Recent Users</h2>
                  <Link
                    to="/admin/users"
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                  >
                    View All <span className="ml-1">→</span>
                  </Link>
                </div>

                {recentUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No users found.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-lg">Username</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-lg">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {recentUsers.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{user.username}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm text-gray-700">{user.email}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                  ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                    user.role === 'company' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'}`}
                                >
                                  {user.role || 'applicant'}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                <Link
                                  to={`/admin/edit-user/${user._id}`}
                                  className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1 rounded inline-block"
                                  title="Edit"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
