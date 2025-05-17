import React from 'react'
import { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function SingUp() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("applicant") // Default role
    const navigate = useNavigate()

    // const handleRegister = (e) => {
    //     e.preventDefault()
    //     axios.post('http://localhost:5000/user/register',{
    //         "username": username,
    //         "email": email,
    //         "password": password
    //     }).then(()=>{
    //         alert("Registered..");
    //         navigate("/login")

    //     }).catch((error)=> console.log(error));
    // }

    const handleRegister = (e) => {
        e.preventDefault();

        // Validate inputs
        if (!username || !email || !password) {
            toast.error("Please fill all the input fields.");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        // Try the new API endpoint first
        axios.post('http://localhost:5000/api/auth/register', {
            "username": username,
            "email": email,
            "password": password,
            "role": role
        }).then((response) => {
            if (response.data.status === true) {
                toast.success("Registration successful!");

                // Store user data and token in localStorage
                localStorage.setItem("user", JSON.stringify({
                    ...response.data.user,
                    token: response.data.token,
                    isAuthenticated: true
                }));

                // Redirect based on user role
                if (role === 'admin') {
                    navigate("/dashboard");
                } else if (role === 'company') {
                    navigate("/company-dashboard");
                } else {
                    navigate("/applicant-dashboard");
                }
            }
        }).catch((error) => {
            console.log("New API error:", error);

            // Fallback to legacy API if new one fails
            axios.post('http://localhost:5000/user/register', {
                "username": username,
                "email": email,
                "password": password
            }).then((response) => {
                if (response.data.status === true) {
                    toast.success("Registration successful!");

                    // Generate a mock token for legacy API (since it doesn't provide one)
                    const mockToken = btoa(`${email}:${Date.now()}`);

                    // Store user data with mock token
                    localStorage.setItem("user", JSON.stringify({
                        username: username,
                        email: email,
                        role: role || 'applicant',
                        token: mockToken,
                        isAuthenticated: true
                    }));

                    // Redirect based on user role
                    if (role === 'admin') {
                        navigate("/dashboard");
                    } else if (role === 'company') {
                        navigate("/company-dashboard");
                    } else {
                        navigate("/applicant-dashboard");
                    }
                } else {
                    toast.error(response.data.message || "Registration failed.");
                }
            }).catch((error) => {
                console.log("Legacy API error:", error);
                toast.error("Registration failed. Please try again.");
            });
        });
    }


  return (
    <div>
        <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create and account
              </h1>
              <form class="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your UserName</label>
                      <input  value={username} onChange={(e)=> setUsername(e.target.value)}
                       type="text" name="" id="" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name" required=""/>
                  </div>

                  <div>
                      <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Email</label>
                      <input  value={email} onChange={(e)=> setEmail(e.target.value)}
                       type="email" name="confirm-password" id="confirm-password" placeholder="name@gmail.com" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input value={password} onChange={(e)=> setPassword(e.target.value)}
                        type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>

                  <div>
                      <label for="role" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Account Type</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        name="role"
                        id="role"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="applicant">Job Seeker</option>
                        <option value="company">Employer/Company</option>
                      </select>
                  </div>

                  <button onClick={handleRegister}
                   type="submit" class="w-full text-white bg-blue-500 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 hover:bg-blue-300 dark:focus:ring-primary-800">Register</button>

                  <p><i class="fa-solid text-2xl fa-arrow-left"></i>
                     <Link className='underline  text-blue-500 text-2xl' to={ "/login"}>Login</Link>  </p>

              </form>
          </div>
      </div>
  </div>
</section>
      <ToastContainer />
    </div>
  )
}

export default SingUp
