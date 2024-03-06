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
import SideNav from "../AdminPanel/SideNav";
import AboutUS from "../Pages/AboutUS";
// import PrivateRoute from "../AdminPanel/PrivateRoute";
// import Applicants from "../Pages/Applicants";
import Users from "../Components/Users";
import UpdateUser from "../Pages/UpdateUser";
import ApplicantsList from "../Components/ApplicantsList";
// import About from "../Pages/About";
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
    {
      path : "/dashboard", 
      element: <Dashboard/>,
     
    },
     {
      path : "/login", 
      element: <Login2/>
    },
    
    {
      path : "/signup", 
      element: <SingUp/>,
     
    },
    {
      path : "/sideNav", 
      element: <SideNav/>,
     
    },
    {
      path : "/myjobs", 
      element: <MyJobs/>,
     
    },
    {
      path: "/post-job", 
      element:<CreateJob/>
    },
    // {
    //   path: "/Applicants", 
    //   element:<Applicants/>
    // },
    {
      path: "/users", 
      element:<Users/>
    },
    {
      path: "/Applicants", 
      element:<ApplicantsList/>
    },
    {
      path: "/edit-user/:id",
      element:<UpdateUser/>,
      loader: ({params}) => fetch(`http://localhost:5000/single/user/${params.id}`)
    },
        

   

    
  
  
   
  ]);

  export default router;