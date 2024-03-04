import Banner from '../Components/Banner'
import { useState,useEffect } from 'react'
import Card from '../Components/Card'
import Jobs from '../Pages/Jobs'
import Sidebar from '../sidebar/Sidebar'
import Newslatter from '../Components/Newslatter'
const Home = () => {
  const [selectCetegory,setSelectedCetegory] = useState(null)
  const [jobs,setjobs] = useState([])
  // loading and pagination
  const [isLoading,setIsLoading] = useState(true)
  const [currentPage,setCurrentPage] = useState(1)
  const itemsPerPage = 6;

      useEffect(()=>{
        setIsLoading(true)
        fetch("http://localhost:5000/all-jobs").then(res=> res.json()).then(data =>{
          setjobs(data)
          setIsLoading(false)
        })

      },[])
      // console.log(jobs)

  const [query,setQuery]  = useState("")
  const handleInputChange = (event) => {
      setQuery(event.target.value)
  }

  // filter jobs by title

const filterItems =  jobs.filter((job)=>job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1)

// radio filtering jobs

     const handleChanges = (event) => {
      setSelectedCetegory(event.target.value)
      }


      // buttons based filtering 
      const handleClick = (event) =>{
        setSelectedCetegory(event.target.value)
      }
      // calculate the index range or Pagination
      const calculatePerPage = () =>{
        const startIndex= (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {startIndex, endIndex}

      }
      // function for next page
      const nextPage = () =>{
        if(currentPage < Math.ceil(filterItems.length / itemsPerPage)){
          setCurrentPage(currentPage + 1)
        }
      }
        //  function forprevios
        const preVious = () => {
          if(currentPage > 1){
            setCurrentPage(currentPage - 1)
          }

        }

    // main functions

    const filteredData = (jobs,selected,query) =>{
      let filteredJobs = jobs;

      // filtering input items
      if(query){
        filteredJobs= filterItems;
      }
      // cetegory filtering 
      if(selected){
        filteredJobs = filteredJobs.filter(
          ({jobLocation,
            maxPrice,
            experienceLevel,
            salaryType,
            employmentType,
            postingDate
          })=>
          jobLocation.toLowerCase() === selected.toLowerCase() || 
        parseInt(maxPrice) <=  parseInt(selected) || 
        postingDate >= selected ||
        salaryType.toLowerCase() === selected.toLowerCase() || 
        experienceLevel.toLowerCase() === selected.toLowerCase() || 
        employmentType.toLowerCase() === selected.toLowerCase() 

      
        )
        console.log(filteredJobs)
      }

      // Slice the Data based on curent page

      const {startIndex, endIndex} = calculatePerPage();

      filteredJobs = filteredJobs.slice(startIndex, endIndex)




      return filteredJobs.map((data,i) =><Card key={i} data={data}/> )

    }

   const result = filteredData(jobs,selectCetegory,query)

  return (
    <div>
      <div >
        
      <div className=' mt-10 flex justify-around pt-6'>
          <div className='bg-orange-200 w-[300px] border-b-2 border-gray-700 text-center h-[200px]'>
            <h1 className='font-bold text-4xl pt-8'>44</h1>
            <p>Total of Products</p>
          </div>
          <div className='bg-blue-200 w-[300px] border-b-2 border-orange-700 text-center h-[200px]'>
          <h1 className='font-bold text-4xl pt-8'>1000</h1>
            <p>Total of Earning</p>
          </div>
          <div className='bg-green-200 w-[300px] border-b-2 border-blue-700 text-center h-[200px]'>
          <h1 className='font-bold text-4xl pt-8'>120</h1>
            <p>Total of Users</p>
          </div>
          
        </div>



        <Banner query={query} handleInputChange={handleInputChange} />
        {/* main content */}
        <div className='bg-[#FAFAFA] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12'>
          {/* left side */}
          <div className='bg-white p-4 rounded' >
            <Sidebar handleChanges={handleChanges} handleClick={handleClick}/>
          </div>
          {/* job cards */}
          <div className='col-span-2 shadow-xl bg-white p-4 rounded-sm'>
          {
            isLoading ? (<p className='font-medium'>Loading...</p>) :  result.length > 0 ?          
             <Jobs  result={result} />
             :<>
              <h3 className='text-lg font-bold mb-2'>{result.length} Jobs</h3>
             <p>No Jobs Here</p>
             </>
          }
          {/* pagination here */}

          {
            result.length > 0 ? (
              <div className='flex justify-center mt-4 space-x-8 '>
              <button onClick={preVious} disabled={currentPage === 1} className='hover:underline'>Previous</button>

        <span className='mx-2'>Page {currentPage} of {Math.ceil(filterItems.length/itemsPerPage)}</span>


              <button onClick={nextPage} 
              disabled={currentPage === Math.ceil(filterItems.length / itemsPerPage)}
              className='hover:underline'>
                Next</button>
              </div>
            ) : ""
          }
          </div>
          {/* right side */}
          <div className='bg-white p-4  shadow-sm rounded'><Newslatter/></div>
        
        </div>


      </div>
    </div>
  )
}

export default Home
