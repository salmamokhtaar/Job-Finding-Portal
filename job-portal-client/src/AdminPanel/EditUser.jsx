import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import SideNav from './SideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';
import axios from 'axios';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        toast.error("No user ID provided");
        navigate("/admin/users");
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching user with ID:", id);

        // First try the legacy endpoint directly
        try {
          const response = await fetch(`http://localhost:5000/single/user/${id}`);
          if (response.ok) {
            const user = await response.json();
            console.log("User found with legacy endpoint:", user);
            
            if (user) {
              setUserData(user);
              setValue("username", user.username || "");
              setValue("email", user.email || "");
              setValue("password", "");
              setValue("role", user.role || "applicant");
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching from legacy endpoint:", error);
        }

        // If direct fetch failed, try getting all users
        try {
          const response = await fetch('http://localhost:5000/get-user');
          if (response.ok) {
            const users = await response.json();
            console.log(`Found ${users.length} users, searching for ID:`, id);
            
            // Find user by ID
            const user = users.find(u => 
              u._id === id || 
              u.id === id || 
              (u._id && u._id.toString() === id.toString())
            );
            
            if (user) {
              console.log("User found in users list:", user);
              setUserData(user);
              setValue("username", user.username || "");
              setValue("email", user.email || "");
              setValue("password", "");
              setValue("role", user.role || "applicant");
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching all users:", error);
        }

        // If we get here, user was not found
        throw new Error(`User with ID ${id} not found`);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error(error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, setValue, navigate]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      console.log("Submitting update for user:", id);
      
      // Remove empty password to keep existing one
      const updateData = { ...data };
      if (!updateData.password) {
        delete updateData.password;
      }
      
      console.log("Update data:", updateData);

      // Try the legacy endpoint first - most likely to work
      const response = await fetch(`http://localhost:5000/user/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      console.log("Update result:", result);

      if (response.ok && (result.status || result.acknowledged || result.value)) {
        toast.success("User updated successfully");
        setTimeout(() => navigate("/admin/users"), 1500);
      } else {
        // If the first attempt failed, try with axios as fallback
        try {
          const axiosResponse = await axios.put(`http://localhost:5000/user/update/${id}`, updateData);
          console.log("Axios response:", axiosResponse.data);
          
          if (axiosResponse.data.status || axiosResponse.data.acknowledged) {
            toast.success("User updated successfully");
            setTimeout(() => navigate("/admin/users"), 1500);
          } else {
            throw new Error("Failed to update user");
          }
        } catch (axiosError) {
          console.error("Axios update failed:", axiosError);
          throw new Error("All update attempts failed");
        }
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <SideNav />
      <div className="ml-[20%] w-[80%] p-8 bg-gray-50 min-h-screen">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg mb-8">
          <h1 className="text-3xl font-bold">Edit User</h1>
          <p className="mt-2 opacity-90">Update user information</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-xl text-gray-600">Loading user data...</p>
            </div>
          </div>
        ) : !userData ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-red-600 mb-2">User Not Found</h2>
            <p className="text-gray-600 mb-4">The user with ID {id} could not be found.</p>
            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Users List
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("username", { required: "Username is required" })}
                      className="pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                      className="pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400" />
                    </div>
                    <input
                      type="password"
                      {...register("password")}
                      placeholder="Leave empty to keep current password"
                      className="pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave empty to keep the current password</p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserTag className="text-gray-400" />
                    </div>
                    <select
                      {...register("role")}
                      className="pl-10 w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="applicant">Applicant</option>
                      <option value="company">Company</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Select the appropriate role for this user</p>
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/admin/users")}
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
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
