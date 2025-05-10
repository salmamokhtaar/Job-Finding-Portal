import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideNav from '../AdminPanel/SideNav';
import { FaSearch, FaEnvelope, FaFileAlt } from 'react-icons/fa';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicantsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/get/applicants');
      setApplicants(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      toast.error('Failed to load applicants');
      setLoading(false);
    }
  };

  const sendConfirmation = (email) => {
    toast.info(`Sending confirmation to ${email}`);
    // Implement email sending logic here
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/applicant/status/${id}`, { status });
      toast.success(`Application status updated to ${status}`);
      fetchApplicants(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Filter applicants based on search term and status
  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch =
      (applicant.email && applicant.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (applicant.name && applicant.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!selectedStatus) {
      return matchesSearch;
    } else {
      return matchesSearch && applicant.status === selectedStatus;
    }
  });

  // Pagination
  const indexOfLastApplicant = currentPage * applicantsPerPage;
  const indexOfFirstApplicant = indexOfLastApplicant - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(indexOfFirstApplicant, indexOfLastApplicant);
  const totalPages = Math.ceil(filteredApplicants.length / applicantsPerPage);

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[22%] w-full pr-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-blue-600">All Applicants</h1>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search applicants by email or name..."
                className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium">Status:</label>
              <select
                id="status-filter"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading applicants...</p>
          </div>
        ) : (
          <>
            {currentApplicants.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-lg text-gray-600">No applicants found matching your criteria.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied For</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentApplicants.map((applicant) => (
                        <tr key={applicant._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{applicant.name || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{applicant.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{applicant.jobTitle || 'N/A'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={applicant.status || 'pending'}
                              onChange={(e) => updateStatus(applicant._id, e.target.value)}
                              className="text-sm rounded-full px-3 py-1 font-medium"
                              style={{
                                backgroundColor:
                                  applicant.status === 'offered' ? '#DEF7EC' :
                                  applicant.status === 'rejected' ? '#FDE8E8' :
                                  applicant.status === 'interviewed' ? '#E1EFFE' :
                                  applicant.status === 'reviewed' ? '#FEF3C7' :
                                  '#F3F4F6',
                                color:
                                  applicant.status === 'offered' ? '#03543E' :
                                  applicant.status === 'rejected' ? '#9B1C1C' :
                                  applicant.status === 'interviewed' ? '#1E429F' :
                                  applicant.status === 'reviewed' ? '#92400E' :
                                  '#374151'
                              }}
                            >
                              <option value="pending">Pending</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="interviewed">Interviewed</option>
                              <option value="offered">Offered</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {applicant.appliedDate ? new Date(applicant.appliedDate).toLocaleDateString() : 'N/A'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => sendConfirmation(applicant.email)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <FaEnvelope className="inline mr-1" /> Contact
                            </button>
                            <button
                              onClick={() => window.open(applicant.resume, '_blank')}
                              className={`text-green-600 hover:text-green-900 ${!applicant.resume ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!applicant.resume}
                            >
                              <FaFileAlt className="inline mr-1" /> View Resume
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredApplicants.length > applicantsPerPage && (
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
      <ToastContainer />
    </div>
  );
};

export default ApplicantsList;
