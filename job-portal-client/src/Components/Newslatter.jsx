import React from 'react'

const Newslatter = () => {
  return (
    <div>
        <div>
            <h3 className='text-lg font-bold mb-2 flex items-center gap-2'>
            <i class="fa-solid fa-envelope"></i>Email Me for hobs
            </h3>
            <p className='text-primary/75 text-base mb-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa, quos.</p>
            <div className='w-full space-y-4'>
            <input  className='w-full block py-2 pl-3 border focus:outline-none'
            type='email' name='email' id='email' placeholder='name@gmail.com'
            />
            <input type="submit" value={"Subscribe"}  className='w-full block py-2 pl-3 border focus:outline-none bg-blue-500 rounded text-white cursor-pointer font-semibold'/>
            </div>
            


        </div>
        {/* part two */}
        <div className='mt-24'>
            <h3 className='text-lg font-bold mb-2 flex items-center gap-2'>
            <i class="fa-solid fa-pen-nib"></i>Get notice faster
            </h3>
            <p className='text-primary/75 text-base mb-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa, quos.</p>
            <div className='w-full space-y-4'>
            <input type="submit" value={"Upload your resume"}  className='w-full block py-2 pl-3 border focus:outline-none bg-blue-500 rounded text-white cursor-pointer font-semibold'/>
            </div>
            


        </div>
    </div>
  )
}

export default Newslatter
