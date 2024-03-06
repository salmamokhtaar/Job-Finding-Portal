import React from 'react'
import {Link} from 'react-router-dom'
import swir from '../assets/d3.png'
import swir1 from '../assets/las.png'
import da from '../assets/j.jpeg'
import d5 from '../assets/d5.png'
function SideNav() {


  return (
    <>
    <div className='bg-blue-500 border-r-2 border-black w-[20%] flex flex-col h-screen fixed text-white text-3xl space-y-8 pl-10 pt-10'>
        <Link to="" className='text-black  text-2xl'>  <i class="fa-solid mt-1 text-2xl font-bold fa-gear"></i> Portal Admin</Link>
        <Link to="/post-job"><i class="fa-brands fa-product-hunt"></i> Post a job</Link>
        <Link to="/myjobs"><i class="fa-solid fa-cart-plus"></i> Jobs</Link>
        <Link to={"/Applicants"}><i class="fa-solid fa-bell"></i> Applicants</Link>
        <Link to={"/users"}><i class="fa-solid fa-users"></i> Users</Link>
        <Link to={"/login"}><i class="fa-solid fa-right-from-bracket"></i> LogOut</Link>
      
    </div>
    <div className='ml-[22%] mr-5 sm:flex justify-around  pt-6'>
          <div className='bg-pink-200 w-[200px] border-b-2 border-gray-700 text-center h-[100px]'>
            <h1 className='font-bold text-black text-4xl pt-8'><i class="fa-solid fa-bell"></i></h1>
            <p>Applicants</p>
          </div>
          <div className='bg-blue-200 w-[200px] border-b-2 border-orange-700 text-center h-[100px]'>
          <h1 className='font-bold text-4xl pt-8'><i class="fa-solid fa-users"></i></h1>
          <p>Users</p>
          </div>
          <div className='bg-green-200 w-[200px] border-b-2 border-blue-700 text-center h-[100px]'>
          <h1 className='font-bold text-4xl pt-8'><i class="fa-solid font-bold fa-plus"></i></h1>
          <p>Jobs</p>
          </div>
          <div className='bg-yellow-100 w-[200px] border-b-2 border-blue-700 text-center h-[100px]'>
          <h1 className='font-bold text-4xl pt-8'><i class="fa-regular fa-address-card"></i></h1>
          <p>Posted</p>
          </div>
          
        </div>
        {/* swiro */}

        <div className='ml-[22%] sm:mt-15 flex gap-20'>
          <div className='bg-blue-500  w-[300px] h-[200px]'>
            <img className='w-[300px] h-[200px] mb-20' src={swir} />
          </div>
          <div className='bg-gray-200  w-[300px] h-[200px] '>
          <img className='' src={da} />
          </div>
          <div className='bg-gray-200  w-[300px] h-[200px]'>
          <img className='w-[400px] h-[200px]' src={swir1} />
          </div> 
          
        </div>
       
       <div className='ml-[50%] w-[300px]'>
        <img src={d5} />
       </div>
        

        {/* <div>
        <h1 className='font-bold cursor-pointer text-4xl sm:text-center underline pt-8 ml-[22%]'><i class="fa-solid mt-1 text-2xl font-bold  fa-gear"></i>Users</h1>
        <div className='bg-blue-300 sm:ml-[50%] sm:mt-8 w-[300px] border-b-2 border-orange-700 text-center h-[200px]'>
          <h1 className='font-bold text-4xl pt-8'></h1>
            <p>Total of Users</p>
          </div>
        

        </div> */}
    </>
  )
}

export default SideNav
