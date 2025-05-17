import React from 'react'
import Location from './Location'
import Salary from './Salary'
import JobPostingData from './JobPostingData'
import WorkExperience from './WorkExperience'
import EmploymentType from './EmploymentType'


const Sidebar = ({handleChanges, handleClick}) => {
  return (
    <div className='sidebar space-y-6 bg-white rounded-lg shadow-md p-6 sticky top-24'>
      <div className="border-b border-gray-200 pb-4">
        <h3 className='text-xl font-bold text-gray-900'>Filters</h3>
        <p className="text-sm text-gray-500 mt-1">Narrow your job search</p>
      </div>

      <Location handleChanges={handleChanges} />
      <Salary handleChanges={handleChanges} handleClick={handleClick}/>
      <JobPostingData handleChanges={handleChanges} />
      <WorkExperience handleChanges={handleChanges} />
      <EmploymentType handleChanges={handleChanges} />

      <div className="pt-4 border-t border-gray-200">
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
          onClick={() => window.location.reload()}
        >
          Reset Filters
        </button>
      </div>
    </div>
  )
}

export default Sidebar
