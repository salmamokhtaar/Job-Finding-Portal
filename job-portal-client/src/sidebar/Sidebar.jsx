import React from 'react'
import Location from './Location'
import Salary from './Salary'
const Sidebar = ({handleChanges,handleClick}) => {
  return (
    <div className='space-y-5'>
      <h3 className='text-lg font-bold mb-2'>Filters</h3>
    <Location  handleChanges={handleChanges} />
    <Salary handleChanges={handleChanges} handleClick={handleClick}/>
    </div>
  )
}

export default Sidebar
