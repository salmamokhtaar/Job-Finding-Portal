import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import SideNav from './SideNav'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEdit, FaTrash } from 'react-icons/fa'

function AllUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [filterRole, setFilterRole] = useState('all')
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setCurrentUser(parsedUser)
    }

    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log('Fetching users...')

      // Try multiple endpoints to get users
      const endpoints = [
        { url: 'http://localhost:5000/api/admin/users', needsAuth: true },
        { url: 'http://localhost:5000/get-user', needsAuth: false },
        { url: 'http://localhost:5000/admin/users', needsAuth: true },
        { url: 'http://localhost:5000/users', needsAuth: false }
      ]

      let fetchSuccess = false

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying to fetch users from: ${endpoint.url}`)

          let response
          const userData = JSON.parse(localStorage.getItem('user') || '{}')

          if (endpoint.needsAuth && userData && userData.token) {
            response = await axios.get(endpoint.url, {
              headers: {
                Authorization: `Bearer ${userData.token}`
              }
            })
          } else {
            response = await axios.get(endpoint.url)
          }

          console.log(`Response from ${endpoint.url}:`, response.data)

          // Handle different response formats
          let usersList = []

          if (response.data.users) {
            usersList = response.data.users
          } else if (Array.isArray(response.data)) {
            usersList = response.data
          } else if (response.data.status && response.data.data) {
            usersList = response.data.data
          }

          if (usersList.length > 0) {
            console.log(`Found ${usersList.length} users`)

            // Ensure each user has an _id property
            const processedUsers = usersList.map(user => {
              // If the user has an id but not _id, use id as _id
              if (user.id && !user._id) {
                return { ...user, _id: user.id }
              }
              return user
            })

            setUsers(processedUsers)
            fetchSuccess = true
            break
          }
        } catch (endpointError) {
          console.error(`Error with endpoint ${endpoint.url}:`, endpointError)
          // Continue to next endpoint
        }
      }

      if (!fetchSuccess) {
        // If all endpoints failed, create some dummy data for testing
        console.warn('All endpoints failed, using dummy data')
        const dummyUsers = [
          {
            _id: '1',
            username: 'admin_user',
            email: 'admin@example.com',
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            username: 'company_user',
            email: 'company@example.com',
            role: 'company',
            createdAt: new Date().toISOString()
          },
          {
            _id: '3',
            username: 'applicant_user',
            email: 'applicant@example.com',
            role: 'applicant',
            createdAt: new Date().toISOString()
          }
        ]
        setUsers(dummyUsers)
        toast.warning('Using sample data - backend connection failed')
      }

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
        // Check if user is trying to delete themselves
        if (currentUser && id === currentUser._id) {
          toast.error("You cannot delete your own account")
          return
        }

        setLoading(true) // Show loading state while deleting

        // Try the correct endpoint for MongoDB
        try {
          console.log(`Attempting to delete user with ID: ${id}`)

          // This is the correct endpoint for deleting users in MongoDB
          const response = await axios.delete(`http://localhost:5000/delete-user/${id}`)

          console.log('Delete response:', response.data)

          if (response.data && (response.data.deletedCount > 0 || response.data.acknowledged === true)) {
            toast.success('User deleted successfully')
            fetchUsers() // Refresh the users list
          } else {
            throw new Error('User not deleted')
          }
        } catch (firstError) {
          console.error('First delete attempt failed:', firstError)

          // Try alternative endpoint
          try {
            const altResponse = await axios.delete(`http://localhost:5000/user/${id}`)
            console.log('Alternative delete response:', altResponse.data)

            if (altResponse.data && (altResponse.data.deletedCount > 0 || altResponse.data.acknowledged === true)) {
              toast.success('User deleted successfully')
              fetchUsers() // Refresh the users list
            } else {
              throw new Error('User not deleted with alternative endpoint')
            }
          } catch (secondError) {
            console.error('Second delete attempt failed:', secondError)

            // Last resort - try with different method
            try {
              const lastResponse = await fetch(`http://localhost:5000/delete-user/${id}`, {
                method: 'DELETE',
              })

              const result = await lastResponse.json()
              console.log('Last resort delete response:', result)

              if (result && (result.deletedCount > 0 || result.acknowledged === true)) {
                toast.success('User deleted successfully')
                fetchUsers() // Refresh the users list
              } else {
                throw new Error('All delete attempts failed')
              }
            } catch (finalError) {
              console.error('Final delete attempt failed:', finalError)
              throw new Error('All delete attempts failed')
            }
          }
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        toast.error(`Failed to delete user: ${error.message}`)
      } finally {
        setLoading(false) // Hide loading state
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

  // We don't need this function anymore since we're using colored badges instead
  // Removing to fix the unused function warning

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[20%] w-[80%] p-8 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold">All Users</h1>
          <p className="mt-2 opacity-90">Manage all users in the system</p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            <span className="font-medium">{users.length}</span> users found
          </div>
          <Link
            to="/admin/create-user"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create New User
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search users by username or email..."
                className="w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="role-filter" className="text-sm font-medium text-gray-700">Role:</label>
              <select
                id="role-filter"
                className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="company">Company</option>
                <option value="applicant">Applicant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading users...</p>
            </div>
          </div>
        ) : (
          <>
            {currentUsers.length === 0 ? (
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-lg text-gray-600">No users found matching your criteria.</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filter settings.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'company' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'}`}
                            >
                              {user.role || 'applicant'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <Link
                                to={`/admin/edit-user/${user._id}`}
                                className="text-blue-600 hover:text-blue-900 bg-blue-50 p-1.5 rounded transition-colors"
                                title="Edit User"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className={`text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded transition-colors
                                  ${currentUser && user._id === currentUser._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                title={currentUser && user._id === currentUser._id ? "Cannot delete your own account" : "Delete User"}
                                disabled={(currentUser && user._id === currentUser._id) || loading} // Prevent deleting yourself or during loading
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
              <div className="flex justify-center mt-8">
                <nav className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`flex items-center px-4 py-2 rounded-md mr-3 transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Previous
                  </button>

                  <div className="px-4 py-2 bg-gray-50 rounded-md text-sm font-medium text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-4 py-2 rounded-md ml-3 transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
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
