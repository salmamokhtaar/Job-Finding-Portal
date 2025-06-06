
import { Link, useNavigate } from 'react-router-dom'
import { FaChartLine, FaBriefcase, FaPlus, FaUsers, FaUserTie, FaSignOutAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

function SideNav() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('user')

    // Show success message
    toast.success('Logged out successfully')

    // Redirect to login page
    navigate('/login')
  }

  return (
    <div className='bg-blue-600 w-[20%] flex flex-col h-screen fixed text-white text-2xl space-y-6 shadow-lg'>
      {/* Header */}
      <div className="bg-blue-700 py-6 px-6 mb-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="px-6 space-y-6">
        {/* Dashboard */}
        <div className="border-b border-blue-400 pb-4">
          <Link to="/dashboard" className="flex items-center hover:bg-blue-700 p-2 rounded-md transition-colors">
            <FaChartLine className="mr-3" /> Dashboard
          </Link>
        </div>

        {/* Job Management */}
        <div className="border-b border-blue-400 pb-4">
          <h3 className="text-lg text-blue-200 mb-3 font-semibold">Job Management</h3>
          <Link to="/admin/jobs" className="flex items-center text-xl mb-3 hover:bg-blue-700 p-2 rounded-md transition-colors">
            <FaBriefcase className="mr-3" /> All Jobs
          </Link>
          <Link to="/admin/create-job" className="flex items-center text-xl hover:bg-blue-700 p-2 rounded-md transition-colors">
            <FaPlus className="mr-3" /> Create Job
          </Link>
        </div>

        {/* User Management */}
        <div className="border-b border-blue-400 pb-4">
          <h3 className="text-lg text-blue-200 mb-3 font-semibold">User Management</h3>
          <Link to="/admin/users" className="flex items-center text-xl mb-3 hover:bg-blue-700 p-2 rounded-md transition-colors">
            <FaUsers className="mr-3" /> All Users
          </Link>
          <Link to="/Applicants" className="flex items-center text-xl hover:bg-blue-700 p-2 rounded-md transition-colors">
            <FaUserTie className="mr-3" /> Applicants
          </Link>
        </div>

        {/* Account */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left hover:bg-blue-700 p-2 rounded-md transition-colors"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default SideNav
