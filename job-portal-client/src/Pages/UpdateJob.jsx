import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

import { ToastContainer ,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UpdateJob = () => {
    const {id} = useParams()
    // console.log(id)
    const {_id, jobTitle,companyName,minPrice,maxPrice,salaryType,jobLocation,postingDate,experienceLevel,employmentType,description,postedBy,skills} = useLoaderData()
     const navigate = useNavigate()
    const [selectedOption , setSelectedOption] = useState(null)
    const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = (data) => {
    data.skills = selectedOption;
    // console.log(data)
    // from db mongodb atlas
    fetch(`http://localhost:5000/update-job/${id}`,{
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(data)
    }).then(res => res.json()).then((result)=>{
      console.log(result)
      if(result.acknowledged === true){
          alert("Job updated successfully")
        navigate("/myjobs")
      } 
      reset()
    })
    
  }

  // skills
  const options =[
    {value : 'HTML CSS', label : 'HTML CSS'},
    {value : 'Javascript ', label : 'Javascript '},
    {value : 'ReactJs', label : 'React js'},
    {value : 'Node js', label : 'Node js'},
    {value : 'MongoDb', label : 'MongoDB'},
    {value : 'Redux', label : 'Redux'},
  ]



  return (
    <div className='max-w-screen container mx-auto xl:px-24 px-4'>
        
    <div className='bg-[#FAFAFA] px-4 py-10  lg:px-16'>
           <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 '>
   
             {/* first row */}
         <div className='create-job-flex'>
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Job Title</label>
         <input type="text" defaultValue={jobTitle} 
         {...register("jobTitle")} className='create-job-input' />
           </div>
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Company name</label>
         <input type="text" placeholder="Ex:Tabarak"
         defaultValue={companyName} 
         {...register("companyName")} className='block w-full flex-1 border-1 bg-white py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:tex-sm ' />
           </div>
   
             </div>
             {/* second */}
         <div className='create-job-flex'>
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Minimum Salary</label>
         <input type="text" placeholder="$20k" 
         defaultValue={minPrice} 
         {...register("minPrice")}
          className='create-job-input'/>
   
           </div>
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Maximum namSalarye</label>
         <input type="text" placeholder="$120k"
         defaultValue={maxPrice} 
         {...register("maxPrice")} 
         className='block w-full flex-1 border-1 bg-white py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:tex-sm ' />
           </div>
   
             </div>
             {/* 3aaaaad */}
              <div className='create-job-flex'>
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Salary Type</label>
             <select {...register("salaryType")}
             defaultValue={salaryType} 
              className='create-job-input'>
           <option value={salaryType}>{salaryType}</option>
           <option value="Hourly">Hourly</option>
           <option value="Monthly">Monthly</option>
           <option value="Yearly">Yearly</option>
         </select>
   
           </div>
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>job Location</label>
         <input type="text" placeholder="Ex: London"
         defaultValue={jobLocation} 
         {...register("jobLocation")} className='block w-full flex-1 border-1 bg-white py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:tex-sm ' />
           </div>
   
             </div>
             {/* fourth */}
             <div className='create-job-flex'>
             <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Job Posting Date</label>
         <input type="date" placeholder="Ex: 2024-01-24"
         defaultValue={postingDate} 
         {...register("postingDate")} className='block w-full flex-1 border-1 bg-white py-1.5 pl-3 text-gray-900 placeholder:text-gray-400 focus:outline-none sm:tex-sm ' />
           </div>
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Experience Level</label>
             <select {...register("experienceLevel")} 
             className='create-job-input'>
           <option value={experienceLevel}>{experienceLevel}</option>
           <option value="Any Experience">Any Experience</option>
           <option value="interneship">Intership</option>
           <option value="no experience">No Experience</option>
         </select>
   
           </div>
         
   
             </div>
             {/* fifth row */}
             <div>
             <label className='block mb-2 text-lg'>Required Skill Sets:</label>
           <CreatableSelect
           onChange={setSelectedOption}
           defaultValue={skills}
           options={options}
           isMulti
           className='create-job-input py-4'
           />
             </div>
             {/* sixthy */}
             <div className='create-job-flex'>
           
           <div className='lg:w1/2 w-full'>
             <label className='block mb-2 text-lg'>Employment Type</label>
             <select {...register("employmentType")}
             defaultValue={employmentType}  
             className='create-job-input'>
           <option value={employmentType}>{employmentType}</option>
           <option value="Full-time">Full Time</option>
           <option value="Part-time">Part Time</option>
           <option value="Temporary">Temporary</option>
         </select>
   
           </div>
         
   
             </div>
            <div className='w-full'>
            <label className='block mb-2 text-lg'>Job Description</label>
            <textarea  
            className='w-full pl-3 py-1.5 focus:outline-none placeholder:text-gray-700'
            rows={6}

            defaultValue={description}  />
   
   
            </div>
            {/* last row */}
            <div className='w-full'>
            <label className='block mb-2 text-lg'>Job Posted by</label>
            <input 
            type="email"
            defaultValue={postedBy} 
             placeholder="your email" 
         {...register("postedBy")} 
         className='create-job-input'/>
   
   
       </div>
         <input type="submit"  
         className='block mt-12 bg-blue-700 textwhite font-semibold px-8 py-2 roumded-sm cursor-pointer text-white'
         />

           </form>
     </div>
          <ToastContainer/>
       </div>
  )
}
<ToastContainer/>
export default UpdateJob
