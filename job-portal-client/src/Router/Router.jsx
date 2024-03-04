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
// import About from "../Pages/About";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children:[
        {path: "/",element:<Home/>},
        // {path: "/about",element:<About/>},
        {path: "/post-job", element:<CreateJob/>},
        {path: "/myjobs", element:<MyJobs/>},
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
    // {
    //   path : "/login", 
    //   element: <Login/>
    // },
     {
      path : "/login", 
      element: <Login2/>
    },
    {
      path : "/dashboard", 
      element: <Dashboard/>,
     
    },
    {
      path : "/signup", 
      element: <SingUp/>,
     
    },
    {
      path : "/sideNav", 
      element: <SideNav/>,
     
    },

   

    
  
  
   
  ]);

  export default router;