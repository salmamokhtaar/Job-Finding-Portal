import React from 'react'
import { useState,useEffect } from 'react'
import PageHeader from '../Components/PageHeader'
const SalayPage = () => {
  const [search,setSearch] = useState("")
  const [salary,setSalary] = useState([])

  useEffect(() =>{
    fetch("salary.json").then(res => res.json()).then((data) => setSalary(data))

  },[search])

  const handleSearch = () => {
    const filter= salary.filter(
    (job)=> job.title.toLowerCase().indexOf(search.toLowerCase()) !== -1)
    console.log(filter)
    setSalary(filter)


  }
  return (
    <div className='max-w-screen-2xl  mb-10 container mx-auto xl:px-24 px-4'>
      <PageHeader title={"Estimate Salary"} path={"Salary"}/>
      <div className='mt-5'>
        <div className='search-box p-2 text-center mb-2'>
            <input type='text' id='search' name='search' 
            className='py-2 pl-3  focus:outline-none border lg:w-6/12 mb-4 w-full'
            onChange={(e) => setSearch(e.target.value)}
            />
        <button onClick={handleSearch}
         className='bg-blue-500 text-white font-semibold px-8 py-2 rounded-sm mb-4'>Search</button>

        </div>

      </div>
      {/* salary display */}
      <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-12 my-1'>
        {
          salary.map((data) => (
            <div key={data.id} className='shadow-xl px-4 py-8'>
              <h4 className='font-semibold text-xl '>{data.title}</h4>
              <p className='my-2 font-medium text-blue-500 text-lg'>{data.salary}</p>
              <div className='flex flex-wrap gap-4'>
                <a href='/' className='underline'>{data.status}</a>
                <a href='/' className='underline'>{data.skills}</a>
              </div>

            </div>

          ))
        }
      </div>
    </div>
    
  )
}

export default SalayPage
