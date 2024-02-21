import React from 'react'
import InputField from '../Components/InputField'
const Location = ({handleChanges}) => {
  return (
    <div>
      <h4 className='text-lg font-medium mb-2'>Location</h4>

      <div>
        <label className='sidebar-label-container'>
        <input type='radio' name='test' id='test' value="" onChange={handleChanges}/>
        <span className='checkmark'></span>All
        </label>

    <InputField 
       handleChanges={handleChanges} 
       value="london"  
       title="London"
        name="test"
          />
           <InputField 
       handleChanges={handleChanges} 
       value="seattle"  
       title="Seattle"
        name="test"
          />
           <InputField 
       handleChanges={handleChanges} 
       value="madrid"  
       title="Madrid"
        name="test"
          />
           <InputField 
       handleChanges={handleChanges} 
       value="boston"  
       title="Boston"
        name="test"
          />
    
      </div>
    </div>
  )
}

export default Location
