import React, { useState } from 'react'

const Banner = ({ query, handleInputChange }) => {
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');

  const jobTypes = [
    { value: '', label: 'All Job Types' },
    { value: 'full-time', label: 'Full-time' },
    { value: 'part-time', label: 'Part-time' },
    { value: 'contract', label: 'Contract' },
    { value: 'internship', label: 'Internship' },
  ];

  return (
    <section className="hero-section bg-hero relative">
      {/* Dark overlay */}
      <div className="hero-overlay"></div>

      {/* Content */}
      <div className="container-custom relative z-10 py-20 md:py-28 lg:py-36">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Find Your <span className="text-brand-400">Dream Job</span> Today
          </h1>
          <p className="text-xl text-white/80 mb-8 animate-slide-up">
            Thousands of jobs in tech, engineering, marketing and more.
            Your next career move is just a search away.
          </p>

          {/* Search Form */}
          <div className="bg-white p-2 rounded-lg shadow-lg animate-slide-up">
            <form className="flex flex-col md:flex-row gap-2">
              {/* Job Title Search */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={query}
                  onChange={handleInputChange}
                />
              </div>

              {/* Location Search */}
              <div className="md:w-1/3 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-map-marker-alt text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="City, state, or remote"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Job Type Filter */}
              <div className="md:w-1/4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-briefcase text-gray-400"></i>
                </div>
                <select
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 appearance-none bg-white"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="btn btn-primary py-3 px-6 md:px-8 whitespace-nowrap"
              >
                Find Jobs
              </button>
            </form>
          </div>

          {/* Popular Searches */}
          <div className="mt-6 text-white/90 animate-fade-in">
            <span className="text-sm font-medium mr-2">Popular Searches:</span>
            <div className="inline-flex flex-wrap gap-2 mt-2">
              <a href="#" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200">
                Software Engineer
              </a>
              <a href="#" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200">
                Data Scientist
              </a>
              <a href="#" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200">
                Product Manager
              </a>
              <a href="#" className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200">
                Remote
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Banner
