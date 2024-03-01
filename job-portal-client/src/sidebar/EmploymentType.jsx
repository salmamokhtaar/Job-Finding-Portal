import React from 'react'
import InputField from '../Components/InputField'

const EmploymentType = ({handleChanges}) => {
  return (
    <div>
    <h4 className='text-lg font-medium mb-2'>Type of Employment</h4>

    <div>
      <label className='sidebar-label-container'>
      <input type='radio' name='test' id='test' value="" onChange={handleChanges}/>
      <span className='checkmark'></span>Any Time
      </label>

  <InputField 
     handleChanges={handleChanges} 
     value="full-time"  
     title="Full-time"
      name="test"
        />
         <InputField
           handleChanges={handleChanges} 
     value="temporary"   
     title="Temporary"
      name="test"
        />
          <InputField
           handleChanges={handleChanges} 
     value="part-time"   
     title="Part-time"
      name="test"
        />
    
    </div>
  </div>
  )
}

export default EmploymentType
