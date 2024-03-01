import React from 'react'
import InputField from '../Components/InputField'

const WorkExperience = ({handleChanges}) => {
  return (
    <div>
    <h4 className='text-lg font-medium mb-2'>Work Experience</h4>

    <div>
      <label className='sidebar-label-container'>
      <input type='radio' name='test' id='test' value="" onChange={handleChanges}/>
      <span className='checkmark'></span>Any experience
      </label>

  <InputField 
     handleChanges={handleChanges} 
     value="intership"  
     title="Intership"
      name="test"
        />
         <InputField
           handleChanges={handleChanges} 
     value="work remotely"   
     title="Work remotely"
      name="test"
        />
    
         <InputField
           handleChanges={handleChanges} 
     value="no experience"    
     title="No Experience"
      name="test"
        />
    
    </div>
  </div>
  )
}

export default WorkExperience
