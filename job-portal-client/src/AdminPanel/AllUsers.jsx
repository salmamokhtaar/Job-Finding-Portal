import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SideNav from './SideNav'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaUserTie, FaUserAlt, FaUserShield, FaEdit, FaTrash } from 'react-icons/fa'

function AllUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [filterRole, setFilterRole] = useState('all')
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }

    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)

      // Try to use the new API endpoint
      try {
        const userData = JSON.parse(localStorage.getItem('user'))
        if (userData && userData.token) {
          const response = await axios.get('http://localhost:5000/api/admin/users', {
            headers: {
              Authorization: `Bearer ${userData.token}`
            }
          })

          if (response.data.status) {
            setUsers(response.data.users)
            setLoading(false)
            return
          }
        }
      } catch (apiError) {
        console.log('API error:', apiError)
      }

      // If we get here, the API call failed
      toast.error('Failed to load users')
      setLoading(false)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const userData = JSON.parse(localStorage.getItem('user'))

        // Check if user is trying to delete themselves
        if (id === userData._id) {
          toast.error("You cannot delete your own account")
          return
        }

        // Use the working legacy API directly
        const response = await axios.delete(`http://localhost:5000/user/${id}`)

        if (response.data && response.data.deletedCount > 0) {
          toast.success('User deleted successfully')
          fetchUsers() // Refresh the users list
        } else {
          toast.error('Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error('Failed to delete user')
      }
    }
  }

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())

    const matchesRole = filterRole === 'all' || user.role === filterRole

    return matchesSearch && matchesRole
  })

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserShield className="text-blue-600" />
      case 'company':
        return <FaUserTie className="text-green-600" />
      case 'applicant':
        return <FaUserAlt className="text-purple-600" />
      default:
        return <FaUserAlt className="text-gray-600" />
    }
  }

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[22%] w-full pr-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600">All Users</h1>
          <Link
            to="/admin/create-user"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Create New User
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search users by username or email..."
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="role-filter" className="text-sm font-medium">Role:</label>
              <select
                id="role-filter"
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All</option>
                <option value="admin">Admin</option>
                <option value="company">Company</option>
                <option value="applicant">Applicant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading users...</p>
          </div>
        ) : (
          <>
            {currentUsers.length === 0 ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-lg text-gray-600">No users found matching your criteria.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="mr-2">{getRoleIcon(user.role)}</span>
                              <span className="text-sm capitalize">{user.role}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Link to={`/admin/edit-user/${user._id}`} className="text-blue-600 hover:text-blue-900" title="Edit">
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className={`text-red-600 hover:text-red-900 ${user._id === (JSON.parse(localStorage.getItem('user'))?._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title="Delete"
                                disabled={user._id === (JSON.parse(localStorage.getItem('user'))?._id)} // Prevent deleting yourself
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
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
  )
}

export default AllUsers
