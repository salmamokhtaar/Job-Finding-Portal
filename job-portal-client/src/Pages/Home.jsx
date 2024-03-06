import Banner from '../Components/Banner'
import { useState,useEffect } from 'react'
import { Link } from 'react-router-dom'
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
        
   
             {/* ku daray */}

             <div className="sm:flex sm:md:mt-[20px] ">
        <div className="sm:w-3/5 mt-[40px]">
          <p className="font-bold md:text-4xl  md:ml-[80px] ml-[30px] text-2xl">Searching, <span className='text-blue-500'>Finding</span> , Working</p>
          <p className="md:ml-[80px] mt-3 md:text-xl text-2xl ml-[30px] "> Please  remeber
            <br />That you are not alone ... <br /> We are always here for you </p>
         <Link to="/"><button className='md:block  md:border-1 text-md bg-blue-600
           ml-[80px] md:ml-[80] mt-[30px] md:font-semibold text-white shadow-md shadow-black rounded h-20px sm:px-6  p-1.5'>Get Your Deserve Job</button></Link> 
        </div>

        <div className="sm:w-2/5 sm:mt-[30px]">
          <img src='https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600' width="400px"  alt="" class="mt-[80px] sm:mt-[0px] sm:rounded p-4 rounded-xl" />
        </div>

               </div>
      {/* boxes */}
 
      <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-12 lg:gap-6 px-4 lg:ml-28 lg:w-[85%] md:w-[70%] sm:px-6 lg:px-6 mt-20 mb-8 justify-around " >
           
           <div class="border text-center py-8 px-5 shadow-md shadow-gray-400  hover:shadow-md hover:shadow-black transition-all duration-1000">
             <img src='https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=600' />
               <h3 class="text-xl font-bold py-4"> FullStack Developer  </h3>
               <p>Last Chance! Devs<br/> Get Your Deserve Job.</p>
           </div>
       <div class="border text-center py-8 px-5 shadow-md shadow-gray-400 hover:shadow-md hover:shadow-black transition-all duration-1000">
       <img src='https://images.pexels.com/photos/3194518/pexels-photo-3194518.jpeg?auto=compress&cs=tinysrgb&w=600' />
               <h3 class="text-xl font-bold py-4"> Software Engineer   </h3>
               <p>Last Chance! Developers  <br/> Get Your Deserve Job.</p>
           </div>
       <div class="border text-center py-8 px-5 shadow-md shadow-gray-400 hover:shadow-md hover:shadow-black transition-all duration-1000 ">
       <img src='https://images.pexels.com/photos/2422286/pexels-photo-2422286.jpeg?auto=compress&cs=tinysrgb&w=600' />
               <h3 class="text-xl font-bold py-4"> Graphic Designers </h3>
               <p>Last Chance! Designers  <br/> Get Your Deserve Job.</p>
           </div>
           <div class="border text-center py-8 px-5 shadow-md shadow-gray-400 hover:shadow-md hover:shadow-black transition-all duration-1000">
           <img src='https://images.pexels.com/photos/1181422/pexels-photo-1181422.jpeg?auto=compress&cs=tinysrgb&w=600' />
               <h3 class="text-xl font-bold py-4">Mobile Apps</h3>
               <p>Last Chance! Devs <br/> orders ends today.</p>
           </div>

 </div>


             {/* ku daray */}


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
