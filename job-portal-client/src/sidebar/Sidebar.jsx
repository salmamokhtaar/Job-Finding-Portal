import React from 'react'
import Location from './Location'
import Salary from './Salary'
import JobPostingData from './JobPostingData'
import WorkExperience from './WorkExperience'
import EmploymentType from './EmploymentType'
const Sidebar = ({handleChanges,handleClick}) => {
  return (
    <div className='space-y-5'>
      <h3 className='text-lg font-bold mb-2'>Filters</h3>
    <Location  handleChanges={handleChanges} />
    <Salary handleChanges={handleChanges} handleClick={handleClick}/>
    <JobPostingData  handleChanges={handleChanges} />
    <WorkExperience  handleChanges={handleChanges} />
    <EmploymentType  handleChanges={handleChanges} />

    </div>
  )
}

export default Sidebar
