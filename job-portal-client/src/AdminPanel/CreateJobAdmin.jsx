import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import SideNav from './SideNav'

const CreateJobAdmin = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Form state
  const [jobData, setJobData] = useState({
    jobTitle: '',
    companyName: '',
    companyLogo: '',
    minSalary: '',
    maxSalary: '',
    salaryType: 'monthly',
    jobLocation: '',
    experienceLevel: 'entry',
    employmentType: 'full-time',
    description: '',
    requirements: '',
    skills: '',
    status: 'active'
  })

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setJobData({
      ...jobData,
      [name]: value
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!jobData.jobTitle || !jobData.companyName || !jobData.minSalary ||
        !jobData.maxSalary || !jobData.jobLocation || !jobData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      // Format data for API
      const formattedData = {
        ...jobData,
        minSalary: Number(jobData.minSalary),
        maxSalary: Number(jobData.maxSalary),
        requirements: jobData.requirements.split(',').map(req => req.trim()),
        skills: jobData.skills.split(',').map(skill => skill.trim())
      }

      // Get user data for posting
      const userData = JSON.parse(localStorage.getItem('user'))

      // Use the working API endpoint directly
      const response = await axios.post('http://localhost:5000/post-job', {
        ...formattedData,
        postedBy: userData.email
      })

      if (response.data) {
        toast.success('Job posted successfully!')
        setTimeout(() => {
          navigate('/admin/jobs')
        }, 1500)
      }
    } catch (error) {
      console.error('Error creating job:', error)
      toast.error('Failed to create job post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[22%] w-full pr-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">Create New Job Post</h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={jobData.jobTitle}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={jobData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Company Logo */}
              <div>
                <label htmlFor="companyLogo" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Logo URL
                </label>
                <input
                  type="text"
                  id="companyLogo"
                  name="companyLogo"
                  value={jobData.companyLogo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Job Location */}
              <div>
                <label htmlFor="jobLocation" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Location *
                </label>
                <input
                  type="text"
                  id="jobLocation"
                  name="jobLocation"
                  value={jobData.jobLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Salary Range */}
              <div>
                <label htmlFor="minSalary" className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Salary *
                </label>
                <input
                  type="number"
                  id="minSalary"
                  name="minSalary"
                  value={jobData.minSalary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="maxSalary" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Salary *
                </label>
                <input
                  type="number"
                  id="maxSalary"
                  name="maxSalary"
                  value={jobData.maxSalary}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Salary Type */}
              <div>
                <label htmlFor="salaryType" className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Type
                </label>
                <select
                  id="salaryType"
                  name="salaryType"
                  value={jobData.salaryType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={jobData.experienceLevel}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="senior">Senior</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              {/* Employment Type */}
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  name="employmentType"
                  value={jobData.employmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Job Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Job Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={jobData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={jobData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            {/* Requirements */}
            <div className="mt-6">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                Requirements (comma separated)
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={jobData.requirements}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor's degree, 2+ years experience, etc."
              ></textarea>
            </div>

            {/* Skills */}
            <div className="mt-6">
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma separated)
              </label>
              <textarea
                id="skills"
                name="skills"
                value={jobData.skills}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="JavaScript, React, Node.js, etc."
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Creating Job...' : 'Create Job Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default CreateJobAdmin
