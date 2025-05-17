import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageHeader from '../Components/PageHeader'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const JobDetail = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [job, setJobs] = useState([])
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)

    // Application form fields
    const [fullName, setFullName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [coverLetter, setCoverLetter] = useState("")
    const fileInputRef = useRef(null)

    // Check if user is logged in
    useEffect(() => {
        const userData = localStorage.getItem('user')
        if (userData) {
            const parsedUser = JSON.parse(userData)
            setUser(parsedUser)

            // Pre-fill form with user data if available
            if (parsedUser.username) setUsername(parsedUser.username)
            if (parsedUser.email) setEmail(parsedUser.email)
        }
    }, [])

    useEffect(() => {
        // Try to fetch from new API first
        axios.get(`http://localhost:5000/api/jobs/${id}`)
            .then(response => {
                if (response.data.status) {
                    setJobs(response.data.job)
                }
            })
            .catch(() => {
                // Fallback to legacy API
                fetch(`http://localhost:5000/all-jobs/${id}`)
                    .then(res => res.json())
                    .then((data) => setJobs(data))
            })
    }, [id])

    const handleApply = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!user) {
            toast.error("Please login to apply for this job")
            // Redirect to login page after a short delay
            setTimeout(() => navigate('/login'), 2000)
            return
        }

        // Check if user is an applicant
        if (user.role !== 'applicant') {
            toast.error("Only applicants can apply for jobs")
            return
        }

        // Validate form fields
        if (!fullName || !username || !email) {
            toast.error("Please fill in all required fields")
            return
        }

        // Check if email is valid
        if (!email.endsWith("@gmail.com")) {
            toast.error("Email must be a Gmail address (@gmail.com)")
            return
        }

        // Check if resume is uploaded
        if (!fileInputRef.current.files[0]) {
            toast.error("Please upload your resume")
            return
        }

        setLoading(true)

        try {
            // Create form data for file upload
            const formData = new FormData()
            formData.append('fullName', fullName)
            formData.append('username', username)
            formData.append('email', email)
            formData.append('coverLetter', coverLetter)
            formData.append('resume', fileInputRef.current.files[0])

            // Send application to new API
            const response = await axios.post(
                `http://localhost:5000/api/applications/jobs/${id}/apply`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${user.token}`
                    }
                }
            )

            if (response.data.status) {
                toast.success("Application submitted successfully!")
                // Reset form
                setFullName("")
                setCoverLetter("")
                fileInputRef.current.value = ""
            }
        } catch (error) {
            console.error("Application error:", error)

            // Try legacy API as fallback
            try {
                await axios.post('http://localhost:5000/user/Applicant', {
                    "email": email
                })
                toast.success("Application submitted successfully!")
            } catch (legacyError) {
                toast.error("Failed to submit application. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    };

  return (
    <div className='job-detail-container'>
        <PageHeader title={"Job Details"} path={"Job Details"}/>

        <div className="job-detail-header">
            <h1 className="job-detail-title">{job.jobTitle || "Loading job details..."}</h1>

            <div className="job-detail-meta">
                <div className="job-detail-meta-item">
                    <i className="fa-solid fa-building job-detail-meta-icon"></i>
                    <span>{job.companyName || "Company"}</span>
                </div>
                <div className="job-detail-meta-item">
                    <i className="fa-solid fa-location-dot job-detail-meta-icon"></i>
                    <span>{job.location || "Location"}</span>
                </div>
                <div className="job-detail-meta-item">
                    <i className="fa-solid fa-money-bill job-detail-meta-icon"></i>
                    <span>{job.minPrice && job.maxPrice ? `$${job.minPrice} - $${job.maxPrice}` : "$30k - $50k"}</span>
                </div>
                <div className="job-detail-meta-item">
                    <i className="fa-solid fa-briefcase job-detail-meta-icon"></i>
                    <span>{job.employmentType || "Full-time"}</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="job-detail-section">
                    <h2 className="job-detail-section-title">Job Description</h2>
                    <div className="job-detail-description">
                        <p>{job.description || "Loading job description..."}</p>
                        <p className="mt-4">Job Portal is the practice of working from one's home or another space rather than from an office. The practice began at a small scale in the 1970s, when technology was developed that linked satellite offices to downtown mainframes through dumb terminals using telephone lines as a network bridge.</p>
                        <p className="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam labore unde facilis. Labore reiciendis officia repellat laborum voluptas praesentium sequi, quo iste unde doloremque, pariatur quia porro iusto voluptates quidem? Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
                    </div>
                </div>

                <div className="job-detail-sections">
                    <div className="job-detail-section-card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                                $30-50k Salary
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                                Disability Insurance
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                                Employment Discount
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                                Flexibility Spending Account
                            </li>
                            <li className="flex items-center">
                                <i className="fa-solid fa-check text-green-500 mr-2"></i>
                                Paid time off
                            </li>
                        </ul>
                    </div>

                    <div className="job-detail-section-card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Outline</h3>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, quasi corrupti. Laudantium unde aut reiciendis mollitia quos omnis, illo quibusdam autem earum quas laboriosam ipsum, nostrum ratione pariatur nulla sed!</p>
                    </div>

                    <div className="job-detail-section-card">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Future Growth</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum quos, eveniet eos esse adipisci reprehenderit odio, provident sed error modi sunt quas doloribus ad ex, eius temporibus veritatis nulla ipsa!</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="job-detail-apply sticky top-24">
                    <h3 className="job-detail-apply-title">Apply for this position</h3>
                    <form className="job-detail-apply-form" onSubmit={handleApply}>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                placeholder="Your full name"
                                className="job-detail-apply-input"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Your username"
                                className="job-detail-apply-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="your@gmail.com"
                                className="job-detail-apply-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">* Must be a Gmail address</p>
                        </div>

                        <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                            <input
                                type="file"
                                id="resume"
                                name="resume"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept=".pdf,.doc,.docx"
                                ref={fileInputRef}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">* PDF, DOC, or DOCX (max 5MB)</p>
                        </div>

                        <div>
                            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                            <textarea
                                id="coverLetter"
                                name="coverLetter"
                                rows="3"
                                placeholder="Tell us why you're a good fit for this position..."
                                className="job-detail-apply-input"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="job-detail-apply-button mt-4 flex justify-center items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : "Apply Now"}
                        </button>
                    </form>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Job ID: {id}</h4>
                        <div className="text-sm text-gray-500">
                            <p>Posted on: {job.postingDate || job.createdAt || "Recent"}</p>
                            <p className="mt-1">Applications close: In 2 weeks</p>
                        </div>
                    </div>
                </div>
                <ToastContainer position="bottom-right" autoClose={5000} />
            </div>
        </div>
    </div>
  )
}

export default JobDetail
