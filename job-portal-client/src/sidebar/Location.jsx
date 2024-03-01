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
       value="mogadishu"  
       title="Mogadishu"
        name="test"
          />
           <InputField 
             handleChanges={handleChanges} 
       value="garowe"  
       title="Garowe"
        name="test"
          />
           <InputField 
       handleChanges={handleChanges} 
       value="hargeisa"  
       title="Hargeisa"
        name="test"
          />
           <InputField 
       handleChanges={handleChanges} 
       value="jowhar"  
       title="Jowhar"
        name="test"
          />
    
      </div>
    </div>
  )
}

export default Location
