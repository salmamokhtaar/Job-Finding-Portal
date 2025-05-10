import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import CreatableSelect from 'react-select/creatable';
import SideNav from './SideNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBriefcase, FaBuilding, FaMoneyBillAlt, FaMapMarkerAlt, FaCalendarAlt, FaUserGraduate } from 'react-icons/fa';

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Skills options
  const options = [
    { value: 'HTML CSS', label: 'HTML CSS' },
    { value: 'Javascript', label: 'Javascript' },
    { value: 'ReactJs', label: 'React js' },
    { value: 'Node js', label: 'Node js' },
    { value: 'MongoDb', label: 'MongoDB' },
    { value: 'Redux', label: 'Redux' },
  ];

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
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

        // Try the new API endpoint first
        try {
          const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('API response not ok');
          }

          const data = await response.json();
          setJobData(data.job);

          // Set form values
          setValue("jobTitle", data.job.jobTitle);
          setValue("companyName", data.job.companyName);
          setValue("minPrice", data.job.minPrice || data.job.minSalary);
          setValue("maxPrice", data.job.maxPrice || data.job.maxSalary);
          setValue("salaryType", data.job.salaryType);
          setValue("jobLocation", data.job.jobLocation);
          setValue("postingDate", data.job.postingDate ? data.job.postingDate.split('T')[0] : '');
          setValue("experienceLevel", data.job.experienceLevel);
          setValue("employmentType", data.job.employmentType);
          setValue("description", data.job.description);
          setValue("postedBy", data.job.postedBy);

          // Set skills
          setSelectedOption(data.job.skills);
        } catch (apiError) {
          console.log('New API error, trying legacy endpoint:', apiError);

          // Fallback to legacy API
          const legacyResponse = await fetch(`http://localhost:5000/all-jobs/${id}`);
          if (!legacyResponse.ok) {
            throw new Error('Legacy API response not ok');
          }

          const legacyData = await legacyResponse.json();
          setJobData(legacyData);

          // Set form values
          setValue("jobTitle", legacyData.jobTitle);
          setValue("companyName", legacyData.companyName);
          setValue("minPrice", legacyData.minPrice || legacyData.minSalary);
          setValue("maxPrice", legacyData.maxPrice || legacyData.maxSalary);
          setValue("salaryType", legacyData.salaryType);
          setValue("jobLocation", legacyData.jobLocation);
          setValue("postingDate", legacyData.postingDate ? legacyData.postingDate.split('T')[0] : '');
          setValue("experienceLevel", legacyData.experienceLevel);
          setValue("employmentType", legacyData.employmentType);
          setValue("description", legacyData.description);
          setValue("postedBy", legacyData.postedBy);

          // Set skills
          setSelectedOption(legacyData.skills);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Failed to load job data');
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    try {
      data.skills = selectedOption;

      // Get auth token from localStorage
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const token = userData.token;

      if (!token) {
        toast.error('Authentication required. Please log in again.');
        navigate('/login');
        return;
      }

      // Try the new API endpoint first
      try {
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          throw new Error('API response not ok');
        }

        const result = await response.json();

        if (result.status === true) {
          toast.success("Job updated successfully");
          setTimeout(() => {
            navigate("/admin/jobs");
          }, 2000);
        } else {
          toast.error(result.message || "Failed to update job");
        }
      } catch (apiError) {
        console.log('New API error, trying legacy endpoint:', apiError);

        // Fallback to legacy API
        const legacyResponse = await fetch(`http://localhost:5000/update-job/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (!legacyResponse.ok) {
          throw new Error('Legacy API response not ok');
        }

        const legacyResult = await legacyResponse.json();

        if (legacyResult.acknowledged === true) {
          toast.success("Job updated successfully");
          setTimeout(() => {
            navigate("/admin/jobs");
          }, 2000);
        } else {
          toast.error("Failed to update job");
        }
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error("An error occurred while updating the job");
    }
  };

  return (
    <div className="flex">
      {/* Side Navigation */}
      <SideNav />

      {/* Main Content */}
      <div className="ml-[22%] w-full pr-8 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Edit Job</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-xl">Loading job data...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBriefcase className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("jobTitle", { required: "Job title is required" })}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle.message}</p>}
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBuilding className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("companyName", { required: "Company name is required" })}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
                </div>

                {/* Min Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Salary</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMoneyBillAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("minPrice")}
                      placeholder="$20k"
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Max Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Salary</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMoneyBillAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("maxPrice")}
                      placeholder="$120k"
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Salary Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary Type</label>
                  <select
                    {...register("salaryType")}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Hourly">Hourly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                {/* Job Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Location</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      {...register("jobLocation")}
                      placeholder="Ex: London"
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Posting Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posting Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      {...register("postingDate")}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUserGraduate className="text-gray-400" />
                    </div>
                    <select
                      {...register("experienceLevel")}
                      className="pl-10 w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Any Experience">Any Experience</option>
                      <option value="Internship">Internship</option>
                      <option value="No Experience">No Experience</option>
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="2-5 Years">2-5 Years</option>
                      <option value="5+ Years">5+ Years</option>
                    </select>
                  </div>
                </div>

                {/* Employment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select
                    {...register("employmentType")}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                {/* Posted By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posted By</label>
                  <input
                    type="email"
                    {...register("postedBy")}
                    placeholder="Your email"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                <CreatableSelect
                  isMulti
                  onChange={setSelectedOption}
                  options={options}
                  value={selectedOption}
                  className="w-full"
                  classNamePrefix="select"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                <textarea
                  {...register("description")}
                  rows={6}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/admin/jobs")}
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

export default EditJob;
