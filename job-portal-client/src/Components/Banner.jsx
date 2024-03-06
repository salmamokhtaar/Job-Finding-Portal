import React from 'react'
const Banner = ({query,handleInputChange}) => {
    
 
  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 md:py-20 py-14'>
    <h1 className='sm:text-5xl text-3xl font-bold text-primary mb-3'>Find your
    <span className='text-blue-700'> new job</span> today</h1>
    <p className='text-lg text-black/70 nb-8'>Thousands of jobs in the computer, engineering and technologysectors are waiting for you.</p>

    <form>
        <div className='flex justify-start md:flex-row flex-col md:gap-0 gap-4' >
            <div className='flex mt-4 md:rounded-s-md rounded shadow-sm ring-1 ring-insert ring-gray-300 focus-within:ring-2 focus-within:ring-insert
             focus-within:ring-indigo-600 md:w-1/2 w-full'>
                <input type="text" placeholder='What position are you looking for?' name='title' id='title' className='block  flex-1 border-0 bg-transparent py-1.5 pl-8 text-gray-900
                 placeholder:text-gray-400 focus:right-0 sm:text-sm sm:leading-6'
                 onChange={handleInputChange}
                 value={query}
                 />
                 <i class="fa-solid absolute mt-2.5 ml-2 text-gray-400 fa-magnifying-glass"></i>
            </div>
            {/* input Location */}

            <div className='flex mt-4 md:rounded-s-none rounded shadow-sm ring-1 ring-insert ring-gray-300 focus-within:ring-2 focus-within:ring-insert
             focus-within:ring-indigo-600 md:w-1/3 w-full'>
               <i class="fa-solid mt-2.5 ml-2 text-gray-400 fa-location-dot"></i>            
                <input type="text" placeholder='Location' name='title' id='title' className='block  flex-1 border-0 bg-transparent py-1.5 pl-8 text-gray-900
                 placeholder:text-gray-400 focus:right-0 sm:text-sm sm:leading-6'
                
                 />
            </div>
            <button type="submit" 
            className='bg-blue-700 mt-0 py-0 px-6 sm:mt-4 text-white md:rounded-s-none rounded '>Search</button>
        </div>
    </form>
    </div>
  )
}

export default Banner
