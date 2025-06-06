import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SideNav from './SideNav'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaCheck, FaTimes, FaEye, FaEdit, FaTrash } from 'react-icons/fa'

function AllJobs() {
  const [jobs, setJobs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [jobsPerPage] = useState(10)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterApproval, setFilterApproval] = useState('all')
  const [rejectionReason, setRejectionReason] = useState('')
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      setLoading(true)

      // Directly use the working API endpoint
      const response = await axios.get('http://localhost:5000/all-jobs')

      if (Array.isArray(response.data)) {
        // Add default approval status for jobs that don't have it
        const jobsWithApproval = response.data.map(job => ({
          ...job,
          approvalStatus: job.approvalStatus || 'approved'
        }))

        setJobs(jobsWithApproval)
      } else {
        setJobs([])
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching jobs:', error)
      toast.error('Failed to load jobs')
      setJobs([])
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData && userData.token) {
          try {
            // Try the new API endpoint
            await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
              headers: {
                Authorization: `Bearer ${userData.token}`
              }
            })
            toast.success('Job deleted successfully')
          } catch (apiError) {
            console.log('API error:', apiError)

            // Fallback to legacy API
            await axios.delete(`http://localhost:5000/job/${id}`)
            toast.success('Job deleted successfully')
          }

          fetchJobs() // Refresh the jobs list
        }
      } catch (error) {
        console.error('Error deleting job:', error)
        toast.error('Failed to delete job')
      }
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Try new API first
      try {
        if (user && user.token) {
          await axios.put(`http://localhost:5000/api/jobs/${id}`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${user.token}` }}
          )
          toast.success(`Job status updated to ${newStatus}`)
          fetchJobs()
          return
        }
      } catch (apiError) {
        console.log('New API error:', apiError)
      }

      // Fallback to legacy API
      await axios.patch(`http://localhost:5000/job/status/${id}`, { status: newStatus })
      toast.success(`Job status updated to ${newStatus}`)
      fetchJobs() // Refresh the jobs list
    } catch (error) {
      console.error('Error updating job status:', error)
      toast.error('Failed to update job status')
    }
  }

  // Handle job approval
  const handleApproveJob = async (id) => {
    try {
      if (user && user.token) {
        await axios.put(`http://localhost:5000/api/admin/jobs/${id}/approval`,
          { approvalStatus: 'approved' },
          { headers: { Authorization: `Bearer ${user.token}` }}
        )
        toast.success('Job approved successfully')
        fetchJobs()
      } else {
        toast.error('You must be logged in as an admin to approve jobs')
      }
    } catch (error) {
      console.error('Error approving job:', error)
      toast.error('Failed to approve job')
    }
  }

  // Open rejection modal
  const openRejectModal = (id) => {
    setSelectedJobId(id)
    setRejectionReason('')
    setShowRejectModal(true)
  }

  // Handle job rejection
  const handleRejectJob = async () => {
    if (!rejectionReason) {
      toast.error('Please provide a reason for rejection')
      return
    }

    try {
      if (user && user.token) {
        await axios.put(`http://localhost:5000/api/admin/jobs/${selectedJobId}/approval`,
          {
            approvalStatus: 'rejected',
            rejectionReason: rejectionReason
          },
          { headers: { Authorization: `Bearer ${user.token}` }}
        )
        toast.success('Job rejected successfully')
        setShowRejectModal(false)
        fetchJobs()
      } else {
        toast.error('You must be logged in as an admin to reject jobs')
      }
    } catch (error) {
      console.error('Error rejecting job:', error)
      toast.error('Failed to reject job')
    }
  }

  // Filter jobs based on search term, status, and approval status
  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      (job.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.companyName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (job.jobLocation?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || job.status === filterStatus
    const matchesApproval = filterApproval === 'all' || job.approvalStatus === filterApproval

    return matchesSearch && matchesStatus && matchesApproval
  })

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage)

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[22%] w-full pr-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">All Job Posts</h1>
          <Link
            to="/admin/create-job"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create New Job
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search jobs by title, company, or location..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="status-filter" className="text-sm font-medium">Status:</label>
                <select
                  id="status-filter"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="approval-filter" className="text-sm font-medium">Approval:</label>
                <select
                  id="approval-filter"
                  className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filterApproval}
                  onChange={(e) => setFilterApproval(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>



        {/* Jobs Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading jobs...</p>
          </div>
        ) : (
          <>
            {currentJobs.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-lg text-gray-600">No jobs found matching your criteria.</p>
                {jobs.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Note: There are {jobs.length} jobs in the database, but they don't match your current filters.
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approval</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentJobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.jobTitle}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.companyName}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.jobLocation}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">${job.minPrice || job.minSalary || 0} - ${job.maxPrice || job.maxSalary || 0}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={job.status || 'active'}
                              onChange={(e) => handleStatusChange(job._id, e.target.value)}
                              className="text-sm rounded-full px-3 py-1 font-medium"
                              style={{
                                backgroundColor:
                                  job.status === 'active' ? '#DEF7EC' :
                                  job.status === 'closed' ? '#FDE8E8' :
                                  '#E1EFFE',
                                color:
                                  job.status === 'active' ? '#03543E' :
                                  job.status === 'closed' ? '#9B1C1C' :
                                  '#1E429F'
                              }}
                            >
                              <option value="active">Active</option>
                              <option value="closed">Closed</option>
                              <option value="draft">Draft</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm rounded-full px-3 py-1 font-medium inline-flex items-center
                              ${job.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                job.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'}`}
                            >
                              {job.approvalStatus === 'approved' ? (
                                <>
                                  <FaCheck className="mr-1" />
                                  Approved
                                </>
                              ) : job.approvalStatus === 'rejected' ? (
                                <>
                                  <FaTimes className="mr-1" />
                                  Rejected
                                </>
                              ) : (
                                <>
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                  Pending
                                </>
                              )}
                            </div>
                            {job.rejectionReason && (
                              <div className="text-xs text-red-600 mt-1">
                                Reason: {job.rejectionReason}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(job.postingDate || job.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link to={`/admin/edit-job/${job._id}`} className="text-blue-600 hover:text-blue-900" title="Edit">
                                <FaEdit />
                              </Link>
                              <Link to={`/job/${job._id}`} className="text-green-600 hover:text-green-900" title="View">
                                <FaEye />
                              </Link>
                              <button
                                onClick={() => handleDelete(job._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <FaTrash />
                              </button>

                              {job.approvalStatus === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleApproveJob(job._id)}
                                    className="text-green-600 hover:text-green-900 bg-green-50 p-1 rounded"
                                    title="Approve Job"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button
                                    onClick={() => openRejectModal(job._id)}
                                    className="text-red-600 hover:text-red-900 bg-red-50 p-1 rounded"
                                    title="Reject Job"
                                  >
                                    <FaTimes />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredJobs.length > jobsPerPage && (
              <div className="flex justify-center mt-6">
                <nav className="flex items-center">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md mr-2 ${
                      currentPage === 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Previous
                  </button>

                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ml-2 ${
                      currentPage === totalPages
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Reject Job</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejecting this job posting.</p>

            <div className="mb-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                Rejection Reason
              </label>
              <textarea
                id="rejectionReason"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this job is being rejected..."
                required
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectJob}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Reject Job
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  )
}

export default AllJobs
