import React from 'react'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'

import { ToastContainer ,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const MyJobs = () => {
  const [jobs,setJobs] = useState([])
  const [searchText,setSearchText] = useState("")
  const [isLoading,setLoading] = useState(true)

  // set current page 
  const [currentPage , setCurrentPage] = useState(1)
  const itemsPerPage = 4;

 
  useEffect(() =>{
    setLoading(true)
    fetch(`http://localhost:5000/myJobs/salma@gmail.com`)
    .then(res => res.json()).then(data => {
      setJobs(data)
      setLoading(false)
      
    })
  },[])

  // pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = jobs.slice(indexOfFirstItem, indexOfLastItem)

  const nextPage = () => {
    if(indexOfLastItem < jobs.length){
      setCurrentPage(currentPage + 1)
    }
    
  }
  const prevPage = () => {
    if(indexOfLastItem >1){
      setCurrentPage(currentPage - 1)
    }

  }

  const handleSearch =() => {
    const filter= jobs.filter((job)=> 
    job.jobTitle.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)
    // console.log(filter)
    setJobs(filter)
    setLoading(false)
  }
  //  kii hore
  const handleDelete = (id) => {
    // console.log(id)
    fetch(`http://localhost:5000/job/${id}`,{
      method: 'DELETE' 
    })
    .then(res => res.json)
    .then((data) => {
      if(data.acknowledged === true) {
        toast("Job is not Deleted successfully")
      } 
      else{
        toast("Job Deleted")
        
      }
    })
  }
  // console.log(searchText)
  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4' >
       <div className='my-job-container'>
    <h1 className='text-center p-4 font-bold text-3xl text-blue-500'>All My Jobs</h1>
        <div className='search-box p-2 text-center mb-2'>
          <input type='text' name='search' id='search'
          onChange={(e) => setSearchText(e.target.value)} 
          onClick={handleSearch}
          className='px-4 py-2 pl-3 border focus:outline-none lg:w-6/12 mb-4 w-full' />
        
          <button className='bg-blue-500 text-white font-semibold px-6 py-2 rounded-sm mb-4'>Search</button>
        </div>
      </div>
      {/* table */}
      <div className="flex flex-col shadow-2xl ">
  <div className="-m-1.5 overflow-x-auto">
    <div className="p-1.5 min-w-full inline-block align-middle">
      <div className="overflow-hidden">
      <div className='flex justify-between '>
       <caption className="py-2 px-10 font-bold  text-blue-500  text-start text-sm  dark:text-gray-500">All Jobs</caption>
          <Link to={"/post-job"}  className="py-1 mt-3 mr-10 rounded-xl bg-blue-500 px-4  text-start text-sm text-white dark:text-gray-500">Post New Job</Link> 
       </div>
        <table className="min-w-full mt-6 divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr>
              <th scope="col" className="px-6  py-3 text-center text-xs font-bold text-black uppercase">No.</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase">title</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase">company name</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase">SALARY</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase">EDIT</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase">DELETE</th>
            </tr>
          </thead>
          {isLoading ? (<div className='flex items-center justify-center h-20'><p>Loading</p></div>)  : 
          (  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {
           currentJobs.map((job,index) => (
             <tr key={index}>
             <td className="px-6 py-4  text-center text-sm font-medium text-gray-800 dark:text-gray-200">{index+1}</td>
             <td className="px-6 py-4  text-center text-sm text-gray-800 dark:text-gray-200">{job.jobTitle}</td>
             <td className="px-6 py-4  text-center text-sm text-gray-800 dark:text-gray-200">{job.companyName}</td>
             <td className="px-6 py-4  text-center text-sm text-gray-800 dark:text-gray-200">{job.minPrice}-{job.maxPrice}</td>
             <td className="px-6 py-4  text-center text-sm text-gray-800 dark:text-gray-200">
               <button><Link to={`/edit-job/${job?._id}`}><i class="fa-solid fa-pen"></i></Link></button>
             </td>
             <td className="px-6 py-4  text-center text-sm text-gray-800 dark:text-gray-200">

             <button onClick={()=> handleDelete(job._id)}
             className='py-2 px-6 rounded-sm'> 
             <i class="fa-solid fa-trash"></i>
             </button></td>
             
           </tr>
   
           ))
          }
   
             
   
            
             </tbody>)
          }
        
        </table>
      </div>
    </div>
  </div>
  {/* paginatios */}
  
</div>
<div className='flex justify-center text-black space-x-8 mb-8'>
    {
      currentPage > 1 && (
        <button onClick={prevPage} className='hover:underline' >Previous</button>
      )
    }
     {
      indexOfLastItem < jobs.length && (
        <button onClick={nextPage} className='hover:underline' >Next</button >
      )
    }
  </div>
  <ToastContainer/>
    </div>
  )
  }

export default MyJobs
