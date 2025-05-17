import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Banner from '../Components/Banner'
import Sidebar from '../sidebar/Sidebar'
import Card from '../Components/Card'
import Jobs from '../Pages/Jobs'
import Newslatter from '../Components/Newslatter'

const Home = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [query, setQuery] = useState("")
  const itemsPerPage = 6;

  // Fetch jobs on component mount
  useEffect(() => {
    setIsLoading(true)
    fetch("http://localhost:5000/all-jobs")
      .then(res => res.json())
      .then(data => {
        setJobs(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching jobs:", error)
        setIsLoading(false)
      })
  }, [])

  // Handle search input change
  const handleInputChange = (event) => {
    setQuery(event.target.value)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Filter jobs by title
  const filterItems = jobs.filter((job) =>
    job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
  )

  // Handle category filter changes
  const handleChanges = (event) => {
    setSelectedCategory(event.target.value)
    setCurrentPage(1) // Reset to first page on new filter
  }

  // Handle category button clicks
  const handleClick = (event) => {
    setSelectedCategory(event.target.value)
    setCurrentPage(1) // Reset to first page on new filter
  }

  // Calculate pagination indices
  const calculatePerPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex }
  }

  // Pagination controls
  const nextPage = () => {
    if (currentPage < Math.ceil(filterItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Main filtering function
  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;

    // Filter by search query
    if (query) {
      filteredJobs = filterItems;
    }

    // Filter by category
    if (selected) {
      filteredJobs = filteredJobs.filter(
        ({
          jobLocation,
          maxPrice,
          experienceLevel,
          salaryType,
          employmentType,
          postingDate
        }) =>
          jobLocation.toLowerCase() === selected.toLowerCase() ||
          parseInt(maxPrice) <= parseInt(selected) ||
          postingDate >= selected ||
          salaryType.toLowerCase() === selected.toLowerCase() ||
          experienceLevel.toLowerCase() === selected.toLowerCase() ||
          employmentType.toLowerCase() === selected.toLowerCase()
      )
    }

    // Apply pagination
    const { startIndex, endIndex } = calculatePerPage();
    filteredJobs = filteredJobs.slice(startIndex, endIndex)

    // Map to card components
    return filteredJobs.map((data, i) => <Card key={i} data={data} />)
  }

  // Get filtered and paginated results
  const result = filteredData(jobs, selectedCategory, query)

  // Featured job categories
  const featuredCategories = [
    {
      id: 1,
      title: "Software Development",
      icon: "fas fa-code",
      count: 120,
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      title: "Marketing & Sales",
      icon: "fas fa-bullhorn",
      count: 78,
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      title: "Design & Creative",
      icon: "fas fa-paint-brush",
      count: 64,
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: 4,
      title: "Finance & Accounting",
      icon: "fas fa-chart-line",
      count: 92,
      color: "bg-yellow-100 text-yellow-800"
    }
  ];

  // Featured companies
  const featuredCompanies = [
    {
      id: 1,
      name: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2048px-Google_%22G%22_Logo.svg.png",
      jobCount: 42,
      location: "Multiple Locations"
    },
    {
      id: 2,
      name: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png",
      jobCount: 35,
      location: "Multiple Locations"
    },
    {
      id: 3,
      name: "Amazon",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png",
      jobCount: 28,
      location: "Multiple Locations"
    },
    {
      id: 4,
      name: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1667px-Apple_logo_black.svg.png",
      jobCount: 31,
      location: "Multiple Locations"
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <Banner query={query} handleInputChange={handleInputChange} />

      {/* Featured Categories Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore job opportunities across various industries and find your perfect career match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <div key={category.id} className="card p-6 hover:border-brand-500 transition-all duration-300">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center mb-4`}>
                  <i className={`${category.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-500 mb-4">{category.count} open positions</p>
                <Link to="/" className="text-brand-600 font-medium hover:text-brand-700 flex items-center">
                  Browse Jobs <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Companies</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Top companies hiring now on our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCompanies.map((company) => (
              <div key={company.id} className="card p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center mb-4">
                  <img src={company.logo} alt={company.name} className="max-w-full max-h-full" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                <p className="text-gray-500 mb-1">{company.location}</p>
                <p className="text-brand-600 font-medium">{company.jobCount} open jobs</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Latest Job Openings</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find your dream job from our latest listings
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Sidebar handleChanges={handleChanges} handleClick={handleClick} />
            </div>

            {/* Job Listings */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
                </div>
              ) : result.length > 0 ? (
                <>
                  <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-lg font-bold">
                      Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filterItems.length)} of {filterItems.length} jobs
                    </h3>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                      <select className="form-input py-1 px-2 text-sm">
                        <option>Most Relevant</option>
                        <option>Newest</option>
                        <option>Highest Salary</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Jobs result={result} />
                  </div>

                  {/* Pagination */}
                  {result.length > 0 && (
                    <div className="flex justify-center mt-8">
                      <nav className="flex items-center space-x-2">
                        <button
                          onClick={previousPage}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                        >
                          <i className="fas fa-chevron-left mr-1"></i> Previous
                        </button>

                        <span className="px-4 py-2 rounded-md bg-brand-600 text-white">
                          {currentPage}
                        </span>

                        <button
                          onClick={nextPage}
                          disabled={currentPage === Math.ceil(filterItems.length / itemsPerPage)}
                          className={`px-4 py-2 rounded-md ${currentPage === Math.ceil(filterItems.length / itemsPerPage) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
                        >
                          Next <i className="fas fa-chevron-right ml-1"></i>
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl text-gray-300 mb-4">
                    <i className="fas fa-search"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-2">No jobs found</h3>
                  <p className="text-gray-500">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </div>

            {/* Newsletter and Featured Jobs */}
            <div className="space-y-6">
              <div className="card p-6">
                <Newslatter />
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-bold mb-4">Featured Jobs</h3>
                <div className="space-y-4">
                  {jobs.slice(0, 3).map((job, index) => (
                    <Link key={index} to={`/job/${job._id}`} className="block p-4 border border-gray-100 rounded-lg hover:border-brand-500 transition-colors duration-200">
                      <div className="flex items-start">
                        <img src={job.companyLogo || 'https://via.placeholder.com/40'} alt={job.companyName} className="w-10 h-10 mr-3 object-contain" />
                        <div>
                          <h4 className="font-medium text-gray-900">{job.jobTitle}</h4>
                          <p className="text-sm text-gray-500">{job.companyName}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <span className="flex items-center">
                              <i className="fas fa-map-marker-alt mr-1"></i> {job.jobLocation}
                            </span>
                            <span className="mx-2">•</span>
                            <span>${job.minPrice}-${job.maxPrice}k</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-brand-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Dream Job?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of job seekers who have found their perfect career match through our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn bg-white text-brand-600 hover:bg-gray-100">
              Create an Account
            </Link>
            <Link to="/" className="btn border border-white text-white hover:bg-brand-700">
              Browse All Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
