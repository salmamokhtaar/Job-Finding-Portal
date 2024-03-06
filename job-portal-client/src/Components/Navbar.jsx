import React from 'react'
import { useState } from 'react'
import { NavLink ,Link} from 'react-router-dom';
// import {FaBarsStaggered}  from 'react-icons/fa6'
const Navbar = () => {
    const [isMenuOpen ,setIsMenuOpen] = useState(false)

    const handleMenuOpen = () => {
        setIsMenuOpen(!isMenuOpen)
    }
    const navItems = [
        {path: "/" ,title:"Start a Search"},
        {path: "/salary" ,title: "Salary Estimated"},
        // {path: "/post-job" ,title: "Post a Job"},
        {path: "/about" ,title: "About US"}

    ]
  return (
    <header className='max-w-screen-2xl mx-auto xl:px-24 px-4 shadow-2xl'> 
      <nav className='flex justify-between items-center py-6'>
        {/* here is logo */}
      <a href="/" className='flex items-center gap-2 text-2xl text-black '>
             <svg
         xmlns="http://www.w3.org/2000/svg" width="29" height="30"
        viewBox="0 0 29 30" fill="none"> 
        <circle cx="12.0143" cy="12.5143" r="12.0143" fill="#3575e2" fillOpacity="0.4"/>
        <circle cx="16.9857" cy="17.4857" r="12.0143" fill="#3575e2" />
        </svg><span>JobPortal</span>
         </a>

         {/* Nav items for Large  devices */}

        <ul className='hidden md:flex gap-12'>
            {
                navItems.map(({path,title}) => (
                    <li key={path} className='text-base text-primary' >
                           <NavLink
                    to={path}
                    className={({ isActive}) =>isActive ? "active": ""
                    }
                  >
                    {title}
                  </NavLink>
                    </li>

                ))
            }
        </ul>

        {/* Sign Up and Login up */}
        <div  className='text-base text-primary font-medium space-x-5 hidden lg:block' >
      <Link to={"/"} className='py-2  px-5 border rounded  bg-blue-500 text-white ' >Get in touch</Link>
      <Link to={"/"} className='py-2 px-5 border rounded'>Book Demo</Link>

        </div>
        {/* mobile menu */}
        <div className='md:hidden block' >
            <button onClick={handleMenuOpen} >
            {
              isMenuOpen ? <i class="fa-solid w-5 h-5 text-black fa-xmark"></i> : <i class="fa-solid w-5 h-5 text-black fa-bars"></i>
            }
            </button>
        </div>
      </nav>
{/* navitems for mobile */}

          <div className={`px-4 bg-black py-5 rounded-sm 
             ${isMenuOpen ? "" : "hidden"}`}>
  <ul>
             {
                navItems.map(({path,title}) => (
                    <li key={path} className='text-base text-white first:text-white py-1' >
                           <NavLink
                    to={path}
                    className={({ isActive}) =>isActive ? "active": ""
                    }
                  >
                    {title}
                  </NavLink>
                    </li>

                ))}
         <li className='text-white py-1'><Link to={"/login"}> Book in Demo</Link>
</li>

  </ul>
</div>

    </header>

    
  )
}

export default Navbar
