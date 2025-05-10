import {createBrowserRouter} from "react-router-dom";
import App from '../App'
import Home from '../Pages/Home'
import CreateJob from "../Pages/CreateJob";
import MyJobs from "../Pages/MyJobs";
import SalayPage from "../Pages/SalayPage";
import UpdateJob from "../Pages/UpdateJob";
import JobDetail from "../Pages/JobDetail";
import Dashboard from "../AdminPanel/Dashboard";
import SingUp from "../AdminPanel/SingUp";
import Login2 from "../AdminPanel/Login2";
import AboutUS from "../Pages/AboutUS";
import PrivateRoute from "../AdminPanel/PrivateRoute";
import Users from "../Components/Users";
import UpdateUser from "../Pages/UpdateUser";
import ApplicantsList from "../Components/ApplicantsList";
import ApplicantDashboard from "../Pages/ApplicantDashboard";
import CompanyDashboard from "../Pages/CompanyDashboard";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children:[
        {path: "/",element:<Home/>},
        {path: "/about", element:<AboutUS/>},
        {path: "/salary", element:<SalayPage/>},
        {
          path: "/edit-job/:id",
          element:<UpdateJob/>,
          loader: ({params}) => fetch(`http://localhost:5000/all-jobs/${params.id}`)
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

    // Job management routes
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

    // User management routes (admin only)
    {
      path: "/users",
      element: <PrivateRoute requiredRole="admin"><Users/></PrivateRoute>
    },
    {
      path: "/Applicants",
      element: <PrivateRoute requiredRole="admin"><ApplicantsList/></PrivateRoute>
    },
    {
      path: "/edit-user/:id",
      element: <PrivateRoute requiredRole="admin"><UpdateUser/></PrivateRoute>,
      loader: ({params}) => fetch(`http://localhost:5000/single/user/${params.id}`)
    },

    // Application routes (applicant only)
    {
      path: "/my-applications",
      element: <PrivateRoute requiredRole="applicant"><ApplicantDashboard/></PrivateRoute>
    },








  ]);

  export default router;