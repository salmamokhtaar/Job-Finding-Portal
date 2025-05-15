import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-20">
      <div className="container-custom">
        {/* Footer Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                viewBox="0 0 29 30" fill="none">
                <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3B82F6" fillOpacity="0.4" />
                <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3B82F6" />
              </svg>
              <span className="text-2xl font-bold font-display">CareerHub</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              CareerHub connects talented professionals with top employers. Find your dream job or the perfect candidate with our comprehensive job portal.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 hover:bg-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">For Job Seekers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/salary" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Salary Guide
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Career Resources
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-lg font-semibold mb-6">For Employers</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/post-job" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Browse Candidates
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Recruitment Solutions
                </Link>
              </li>
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Stay Updated</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for job updates</p>
            <form className="mb-6">
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 transition-colors duration-300 text-white font-medium py-2 px-4 rounded-md"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="text-gray-400">
              <p className="flex items-center mb-2">
                <i className="fas fa-envelope mr-3 text-brand-500"></i>
                contact@careerhub.com
              </p>
              <p className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-brand-500"></i>
                +1 (555) 123-4567
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CareerHub. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link to="/" className="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </Link>
            <Link to="/" className="text-gray-500 hover:text-white text-sm transition-colors duration-200">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
