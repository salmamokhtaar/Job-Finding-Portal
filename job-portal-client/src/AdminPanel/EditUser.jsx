import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import SideNav from './SideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);

        // Get auth token from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const token = userData.token;

        if (!token) {
          toast.error('Authentication required. Please log in again.');
          navigate('/login');
          return;
        }

        // Directly use the get-user endpoint which is known to work
        const allUsersResponse = await fetch('http://localhost:5000/get-user');

        if (!allUsersResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        const allUsers = await allUsersResponse.json();
        const user = allUsers.find(u => u._id === id);

        if (!user) {
          throw new Error('User not found');
        }

        console.log("User found:", user);
        setUserData(user);

        // Set form values
        setValue("username", user.username);
        setValue("email", user.email);
        setValue("password", ""); // Don't show actual password for security
        setValue("role", user.role || "applicant");

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      // Get auth token from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = userData.token;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }

      console.log("Submitting user update:", data);

      // If password is empty, remove it from the data to keep the existing password
      const updateData = {...data};
      if (!updateData.password) {
        delete updateData.password;
      }

      console.log("Cleaned update data:", updateData);

      // Use the correct legacy endpoint for updating users
      try {
        const response = await fetch(`http://localhost:5000/user/update/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });

        const result = await response.json();
        console.log("Update result:", result);

        if (result.status === true) {
          toast.success("User updated successfully");
          setTimeout(() => {
            navigate("/admin/users");
          }, 2000);
        } else {
          toast.error(result.message || "Failed to update user");
        }
      } catch (error) {
        console.error('Update error:', error);
        toast.error("An error occurred while updating the user");
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("An error occurred while updating the user");
    }
  };

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[22%] w-full pr-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Edit User</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading user data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("username", { required: "Username is required" })}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      {...register("password", {
                        // Only require password if it's a new user
                        validate: value => {
                          // If editing an existing user and password is empty, it's ok (we'll keep the old password)
                          if (id && !value) return true;
                          // Otherwise require a password
                          return !!value || "Password is required";
                        }
                      })}
                      placeholder="Leave empty to keep current password"
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserTag className="text-gray-400" />
                    </div>
                    <select
                      {...register("role")}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="applicant">Applicant</option>
                      <option value="company">Company</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditUser;
