import React, { useState } from 'react'

const Button = ({onClickHandler, value, title}) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = (e) => {
    setIsActive(!isActive);
    onClickHandler(e);
  }

  return (
    <button
      onClick={handleClick}
      value={value}
      className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-200 mr-2 mb-2
        ${isActive
          ? 'bg-blue-600 text-white border-blue-600'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
    >
      {title}
    </button>
  )
}

export default Button
