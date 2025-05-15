import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

const Card = ({ data }) => {
  const {
    _id,
    companyName,
    jobTitle,
    minPrice,
    companyLogo,
    maxPrice,
    salaryType,
    jobLocation,
    employmentType,
    postingDate,
    description
  } = data

  // Format the posting date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Truncate description
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  return (
    <div className="job-card group">
      <Link to={`/job/${_id}`} className="block">
        <div className="job-card-header">
          <div className="flex items-center">
            <div className="w-12 h-12 flex-shrink-0 rounded-md overflow-hidden border border-gray-200 bg-white p-1 mr-4">
              <img
                src={companyLogo || 'https://via.placeholder.com/48?text=Logo'}
                alt={companyName}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h4 className="job-card-company">{companyName}</h4>
              <h3 className="job-card-title group-hover:text-brand-600 transition-colors duration-200">{jobTitle}</h3>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="badge badge-blue">
              {employmentType}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <i className="fas fa-map-marker-alt text-gray-400"></i> {jobLocation}
          </span>
          <span className="flex items-center gap-1">
            <i className="fas fa-dollar-sign text-gray-400"></i> {salaryType}: ${minPrice}k-${maxPrice}k
          </span>
          <span className="flex items-center gap-1">
            <i className="fas fa-calendar-alt text-gray-400"></i> {formatDate(postingDate)}
          </span>
        </div>

        <p className="text-gray-600 mb-4 text-sm">
          {truncateText(description, 150)}
        </p>

        <div className="job-card-tags">
          {employmentType && (
            <span className="job-tag">
              {employmentType}
            </span>
          )}
          <span className="job-tag">
            {salaryType}
          </span>
          <span className="job-tag">
            Remote
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Posted {formatDate(postingDate)}
          </span>
          <span className="text-brand-600 font-medium text-sm flex items-center group-hover:underline">
            View Details <i className="fas fa-arrow-right ml-1 transition-transform group-hover:translate-x-1"></i>
          </span>
        </div>
      </Link>
    </div>
  )
}

export default Card
