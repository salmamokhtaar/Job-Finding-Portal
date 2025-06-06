import {createBrowserRouter} from "react-router-dom";
import App from '../App'
import Home from '../Pages/Home'
import CreateJob from "../Pages/CreateJob";
import MyJobs from "../Pages/MyJobs";
import SalaryPage from "../Pages/SalaryPage";
import UpdateJob from "../Pages/UpdateJob";
import JobDetail from "../Pages/JobDetail";
import Dashboard from "../AdminPanel/Dashboard";
import SingUp from "../AdminPanel/SingUp";
import Login2 from "../AdminPanel/Login2";
import AboutUs from "../Pages/AboutUS";
import Contact from "../Pages/Contact";
import PrivateRoute from "../AdminPanel/PrivateRoute";
import Users from "../Components/Users";
import UpdateUser from "../Pages/UpdateUser";
import ApplicantsList from "../Components/ApplicantsList";
import ApplicantDashboard from "../Pages/ApplicantDashboard";
import CompanyDashboard from "../Pages/CompanyDashboard";
import AllJobs from "../AdminPanel/AllJobs";
import CreateJobAdmin from "../AdminPanel/CreateJobAdmin";
import EditUser from "../AdminPanel/EditUser";
import EditJob from "../AdminPanel/EditJob";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children:[
        {path: "/",element:<Home/>},
        {path: "/about", element:<AboutUs/>},
        {path: "/salary", element:<SalaryPage/>},
        {path: "/contact", element:<Contact/>},
        {
          path: "/edit-job/:id",
          element: <PrivateRoute requiredRoles={["company", "admin"]}><UpdateJob/></PrivateRoute>,
          loader: ({params}) => fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/jobs/${params.id}`)
        },

        {
          path : "/job/:id",
          element: <JobDetail/>
        }


      ]
    },
    // Authentication routes
    {
      path: "/login",
      element: <Login2/>
    },
    {
      path: "/signup",
      element: <SingUp/>
    },

    // Role-based dashboards
    {
      path: "/dashboard",
      element: <PrivateRoute requiredRole="admin"><Dashboard/></PrivateRoute>
    },
    {
      path: "/applicant-dashboard",
      element: <PrivateRoute requiredRole="applicant"><ApplicantDashboard/></PrivateRoute>
    },
    {
      path: "/company-dashboard",
      element: <PrivateRoute requiredRole="company"><CompanyDashboard/></PrivateRoute>
    },

    // Job management routes (company)
    {
      path: "/myjobs",
      element: <PrivateRoute requiredRole="company"><MyJobs/></PrivateRoute>
    },
    {
      path: "/post-job",
      element: <PrivateRoute requiredRole="company"><CreateJob/></PrivateRoute>
    },
    {
      path: "/manage-jobs",
      element: <PrivateRoute requiredRole="company"><MyJobs/></PrivateRoute>
    },

    // Admin job management routes
    {
      path: "/admin/jobs",
      element: <PrivateRoute requiredRole="admin"><AllJobs/></PrivateRoute>
    },
    {
      path: "/admin/create-job",
      element: <PrivateRoute requiredRole="admin"><CreateJobAdmin/></PrivateRoute>
    },
    {
      path: "/admin/edit-job/:id",
      element: <PrivateRoute requiredRole="admin"><EditJob/></PrivateRoute>
    },

    // User management routes (admin only)
    {
      path: "/admin/users",
      element: <PrivateRoute requiredRole="admin"><Users/></PrivateRoute>
    },
    {
      path: "/Applicants",
      element: <PrivateRoute requiredRole="admin"><ApplicantsList/></PrivateRoute>
    },
    {
      path: "/edit-user/:id",
      element: <PrivateRoute requiredRole="admin"><UpdateUser/></PrivateRoute>,
      loader: ({params}) => fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/users/${params.id}`)
    },
    {
      path: "/admin/edit-user/:id",
      element: <PrivateRoute requiredRole="admin"><EditUser/></PrivateRoute>
    },

    // Application routes (applicant only)
    {
      path: "/my-applications",
      element: <PrivateRoute requiredRole="applicant"><ApplicantDashboard/></PrivateRoute>
    },








  ]);

  export default router;