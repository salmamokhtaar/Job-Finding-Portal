import React from 'react'
import InputField from '../Components/InputField'

const JobPostingData = ({handleChanges}) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 *60 *1000)
    const SevenDaysAgo = new Date(now - 7 * 24 * 60 *60 *1000)
    const ThirtyDaysAgo = new Date(now - 30 *  24 * 60 *60 *1000)
    // console.log(twentyFourHoursAgo)

    // converting date to string
    const twentyFourHoursAgoDate = twentyFourHoursAgo.toISOString().slice(0,10)
    const SevenDaysAdoDate = SevenDaysAgo.toISOString().slice(0,10)
    const ThirtyDaysAgoDate = ThirtyDaysAgo.toISOString().slice(0,10)

    // console.log(twentyFourHoursAgoDate) 
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Date of Posting</h4>

      <div>
        <label className='sidebar-label-container'>
        <input type='radio' name='test' id='test' value="" onChange={handleChanges}/>
        <span className='checkmark'></span>All time
        </label>

    
           <InputField 
             handleChanges={handleChanges} 
       value={twentyFourHoursAgoDate}
       title="Last 24 hours"
        name="test"
          />
           <InputField 
       handleChanges={handleChanges} 
       value={SevenDaysAdoDate} 
       title="Last 7 days"
        name="test"
          />
           <InputField 
       handleChanges={handleChanges} 
       value={ThirtyDaysAgoDate}  
       title="Last Month"
        name="test"
          />
    
      </div>
    </div>
  )
}

export default JobPostingData
