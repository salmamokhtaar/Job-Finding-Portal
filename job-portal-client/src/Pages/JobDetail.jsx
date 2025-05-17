import React from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../Components/PageHeader'
import { useState, useEffect } from 'react'
import axios from 'axios'


const JobDetail = () => {
    const {id} = useParams()
    const [job, setJobs] = useState([])
    const [email, setEmail] = useState("")

    useEffect(() => {
        fetch(`http://localhost:5000/all-jobs/${id}`)
        .then(res => res.json())
        .then((data) => setJobs(data))
    }, [id])

    const handleApply = (e) => {
      e.preventDefault();

      // Check if email ends with "@gmail.com"
      if (!email.endsWith("@gmail.com")) {
        alert("Email must be a Gmail address @gmail.com.");
        return;
      }
      // If email is valid, send the request
      axios.post('http://localhost:5000/user/Applicant', {
        "email": email
      }).then(() => {
          alert("Email Sent Successfully");
        }).catch((error) => console.log(error));
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
                        <button type="submit" className="job-detail-apply-button mt-4">
                            Apply Now
                        </button>
                    </form>

                    <div className="mt-6 border-t border-gray-200 pt-4">
                        <h4 className="font-medium text-gray-900 mb-2">Job ID: {id}</h4>
                        <div className="text-sm text-gray-500">
                            <p>Posted on: {job.postingDate || "Recent"}</p>
                            <p className="mt-1">Applications close: In 2 weeks</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default JobDetail
