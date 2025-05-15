import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SalaryPage = () => {
  const [search, setSearch] = useState('');
  const [salary, setSalary] = useState([]);
  const [filteredSalary, setFilteredSalary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Job categories for filtering
  const categories = [
    'All',
    'Technology',
    'Healthcare',
    'Finance',
    'Marketing',
    'Education',
    'Engineering'
  ];

  // Mapping job titles to categories
  const jobCategories = {
    'Software Engineer': 'Technology',
    'Backend Developer': 'Technology',
    'App Developer': 'Technology',
    'UI/UX Designer': 'Technology',
    'Web Developer': 'Technology',
    'Full Stack Developer': 'Technology',
    'Warehouse Associate': 'Logistics',
    'Front Desk Agent': 'Hospitality',
    'Crew Member': 'Service'
  };

  // Fetch salary data
  useEffect(() => {
    setLoading(true);
    fetch('/salary.json')
      .then(res => res.json())
      .then(data => {
        setSalary(data);
        setFilteredSalary(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching salary data:', error);
        setLoading(false);
      });
  }, []);

  // Handle search
  const handleSearch = () => {
    if (search.trim() === '') {
      // If search is empty, reset to all jobs or filtered by category
      if (selectedCategory === 'All') {
        setFilteredSalary(salary);
      } else {
        const filtered = salary.filter(job => 
          jobCategories[job.title] === selectedCategory
        );
        setFilteredSalary(filtered);
      }
    } else {
      // Filter by search term and possibly category
      let filtered = salary.filter(job => 
        job.title.toLowerCase().includes(search.toLowerCase())
      );
      
      // Apply category filter if not 'All'
      if (selectedCategory !== 'All') {
        filtered = filtered.filter(job => 
          jobCategories[job.title] === selectedCategory
        );
      }
      
      setFilteredSalary(filtered);
    }
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      if (search.trim() === '') {
        setFilteredSalary(salary);
      } else {
        const filtered = salary.filter(job => 
          job.title.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredSalary(filtered);
      }
    } else {
      let filtered = salary.filter(job => 
        jobCategories[job.title] === category
      );
      
      // Apply search filter if there's a search term
      if (search.trim() !== '') {
        filtered = filtered.filter(job => 
          job.title.toLowerCase().includes(search.toLowerCase())
        );
      }
      
      setFilteredSalary(filtered);
    }
  };

  // Additional salary data for the salary trends chart
  const salaryTrends = [
    { role: 'Software Engineer', entry: 70000, mid: 100000, senior: 150000 },
    { role: 'Data Scientist', entry: 80000, mid: 120000, senior: 170000 },
    { role: 'Product Manager', entry: 85000, mid: 130000, senior: 180000 },
    { role: 'UX Designer', entry: 65000, mid: 95000, senior: 140000 },
    { role: 'DevOps Engineer', entry: 75000, mid: 110000, senior: 160000 }
  ];

  return (
    <div className="bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-brand-600 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Salary Guide</h1>
            <p className="text-xl text-white/90 mb-8">
              Explore salary information for different roles and make informed career decisions
            </p>
            
            {/* Search Bar */}
            <div className="bg-white p-2 rounded-lg shadow-lg max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400"></i>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search job titles..." 
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="btn btn-primary py-3 px-6 whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container-custom">
          {/* Category Filters */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Salary Results */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Salary Information</h2>
              <p className="text-gray-500">
                {filteredSalary.length} {filteredSalary.length === 1 ? 'result' : 'results'} found
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
              </div>
            ) : filteredSalary.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSalary.map((data) => (
                  <div key={data.id} className="card p-6 hover:border-brand-500 transition-all duration-300">
                    <h3 className="text-xl font-bold mb-3">{data.title}</h3>
                    <p className="text-brand-600 font-medium text-lg mb-4">{data.salary}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <Link to="/" className="text-brand-600 hover:underline flex items-center">
                        <i className="fas fa-briefcase mr-2"></i> {data.status}
                      </Link>
                      <Link to="/" className="text-brand-600 hover:underline flex items-center">
                        <i className="fas fa-graduation-cap mr-2"></i> {data.skills}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-5xl text-gray-300 mb-4">
                  <i className="fas fa-search"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search or browse all categories
                </p>
                <button 
                  onClick={() => {
                    setSearch('');
                    setSelectedCategory('All');
                    setFilteredSalary(salary);
                  }}
                  className="btn btn-outline"
                >
                  View All Salaries
                </button>
              </div>
            )}
          </div>

          {/* Salary Trends Section */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6">Salary Trends by Experience Level</h2>
            <p className="text-gray-600 mb-8">
              Compare salary ranges across different roles and experience levels to plan your career path.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mid Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Senior Level</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salaryTrends.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.entry.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.mid.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.senior.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Salary Resources */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Salary Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-calculator text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Salary Calculator</h3>
                <p className="text-gray-600 mb-4">
                  Calculate your expected salary based on role, location, and experience.
                </p>
                <Link to="/" className="text-brand-600 font-medium hover:text-brand-700 flex items-center">
                  Try Calculator <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
              
              <div className="card p-6">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-book text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Negotiation Guide</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to negotiate your salary effectively with our comprehensive guide.
                </p>
                <Link to="/" className="text-brand-600 font-medium hover:text-brand-700 flex items-center">
                  Read Guide <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
              
              <div className="card p-6">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-chart-line text-xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-3">Industry Reports</h3>
                <p className="text-gray-600 mb-4">
                  Access detailed reports on salary trends across different industries.
                </p>
                <Link to="/" className="text-brand-600 font-medium hover:text-brand-700 flex items-center">
                  View Reports <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalaryPage;
