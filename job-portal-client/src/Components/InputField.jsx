import React from 'react'

const InputField = ({handleChanges,value,title,name}) => {
  return (
    <label className='sidebar-label-container'>
    <input
     type='radio'
      name={name}
      value={value}
        onChange={handleChanges}/>
    <span className='checkmark'></span>{title}
    
    </label>
  )
}

export default InputField
