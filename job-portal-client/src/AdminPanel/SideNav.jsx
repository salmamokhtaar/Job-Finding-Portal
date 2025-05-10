
import {Link} from 'react-router-dom'

function SideNav() {


  return (
    <>
    <div className='bg-blue-500 border-r-2 border-black w-[20%] flex flex-col h-screen fixed text-white text-3xl space-y-8 pl-10 pt-10'>
    

        {/* Dashboard */}
        <div className="border-b border-gray-300 pb-2">
          <Link to="/dashboard" className="flex items-center">
            <i className="fa-solid fa-chart-line mr-2"></i> Dashboard
          </Link>
        </div>

        {/* Job Management */}
        <div className="border-b border-gray-300 pb-2">
          <h3 className="text-xl text-gray-200 mb-2">Job Management</h3>
          <Link to="/admin/jobs" className="flex items-center text-xl mb-2">
            <i className="fa-solid fa-briefcase mr-2"></i> All Jobs
          </Link>
          <Link to="/admin/create-job" className="flex items-center text-xl">
            <i className="fa-solid fa-plus mr-2"></i> Create Job
          </Link>
        </div>

        {/* User Management */}
        <div className="border-b border-gray-300 pb-2">
          <h3 className="text-xl text-gray-200 mb-2">User Management</h3>
          <Link to="/admin/users" className="flex items-center text-xl mb-2">
            <i className="fa-solid fa-users mr-2"></i> All Users
          </Link>
          <Link to="/Applicants" className="flex items-center text-xl">
            <i className="fa-solid fa-user-tie mr-2"></i> Applicants
          </Link>
        </div>

        {/* Account */}
        <div>
          <Link to="/login" className="flex items-center">
            <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
          </Link>
        </div>
    </div>


    </>
  )
}

export default SideNav
