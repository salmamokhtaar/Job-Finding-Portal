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
      <div className="ml-[22%] w-full pr-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Admin Dashboard</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 mr-4">
                    <FaBriefcase className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Jobs</p>
                    <h3 className="text-2xl font-bold">{stats.totalJobs}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 mr-4">
                    <FaUsers className="text-green-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-purple-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 mr-4">
                    <FaUserTie className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Total Applicants</p>
                    <h3 className="text-2xl font-bold">{stats.totalApplicants}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 mr-4">
                    <FaChartLine className="text-yellow-500 text-xl" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Active Jobs</p>
                    <h3 className="text-2xl font-bold">{stats.activeJobs}</h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Jobs by Category Chart */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Jobs by Category</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Users by Role Chart */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Users by Role</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={usersByRole}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
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
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Jobs by Location Chart */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Top Job Locations</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={jobsByLocation}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="jobs" fill="#8884d8" name="Jobs" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Application Status Chart */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold mb-4">Application Status</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={applicationStatus}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name="Applications" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Jobs */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Job Posts</h2>
                <Link to="/admin/jobs" className="text-blue-500 hover:underline text-sm">View All</Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentJobs.map((job) => (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{job.companyName}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{job.jobLocation}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-500">${job.minSalary} - ${job.maxSalary}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          <Link to={`/admin/edit-job/${job._id}`} className="text-blue-600 hover:text-blue-900 mr-2">
                            Edit
                          </Link>
                          <Link to={`/job/${job._id}`} className="text-green-600 hover:text-green-900">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Users</h2>
                <Link to="/users" className="text-blue-500 hover:underline text-sm">View All</Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm text-gray-500 capitalize">{user.role || 'applicant'}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          <Link to={`/admin/edit-user/${user._id}`} className="text-blue-600 hover:text-blue-900">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
