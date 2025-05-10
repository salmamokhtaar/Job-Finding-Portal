import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SideNav from '../AdminPanel/SideNav'
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function Users() {
  const [users,setUsers] = useState([])
  const [searchText,setSearchText] = useState("")
  const [isLoading,setLoading] = useState(true)

  const [currentPage , setCurrentPage] = useState(1)
  const itemsPerPage = 4;


  useEffect(() =>{
    setLoading(true)
    fetch(`http://localhost:5000/get-user`)
    .then(res => res.json()).then(data => {
      setUsers(data)
      setLoading(false)

    })
  },[])

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = users.slice(indexOfFirstItem, indexOfLastItem)

  const nextPage = () => {
    if(indexOfLastItem < users.length){
      setCurrentPage(currentPage + 1)
    }

  }
  const prevPage = () => {
    if(indexOfLastItem >1){
      setCurrentPage(currentPage - 1)
    }

  }

  const handleSearch =() => {
    const filter= users.filter((user)=>
    user.username.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    // console.log(filter)
    setUsers(filter)
    setLoading(false)
  }
  //  kii hore
  const handleDelete = (id) => {
    // console.log(id)
    fetch(`http://localhost:5000/user/${id}`,{
      method: 'DELETE'
    })
    .then(res => res.json)
    .then((data) => {
      if(data.acknowledged === true) {
        toast("Job is not Deleted successfully")
      }
      else{
        toast("User Deleted")

      }
    })
  }
  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[22%] w-full pr-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">All Users</h1>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users by username..."
                className="w-full px-4 py-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <FaSearch />
              </div>
            </div>
            <button
              onClick={handleSearch}
              className="ml-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Search
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-xl">Loading users...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Password</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentJobs.map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{indexOfFirstItem + index + 1}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500 capitalize">{user.role || 'applicant'}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500">••••••••</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/admin/edit-user/${user?._id}`}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, users.length)}
                    </span>{" "}
                    of <span className="font-medium">{users.length}</span> users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Previous
                    </button>
                    <button
                      onClick={nextPage}
                      disabled={indexOfLastItem >= users.length}
                      className={`px-3 py-1 rounded-md ${
                        indexOfLastItem >= users.length
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Users
