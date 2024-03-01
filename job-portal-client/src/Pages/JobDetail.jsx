import React from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../Components/PageHeader'
import { useState,useEffect } from 'react'
import Swal from 'sweetalert2'

const JobDetail = () => {
    const {id} = useParams()
    const [job,setJobs] = useState([])
    useEffect(()=> {
        fetch(`http://localhost:5000/all-jobs/${id}`)
        .then(res => res.json())
        .then((data) => setJobs(data))
    },[])

    const handleApply = async () =>{
        const { value: email } = await Swal.fire({
            title: "Input email address",
            input: "email",
            inputLabel: "Your email address",
            inputPlaceholder: "Enter your email address"
          });
          if (email) {
            Swal.fire(`Entered email: ${email}`);
          }

    }
    
  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
        <PageHeader title={"Single Job Pagw"} path={"Single Job"}/>
        <h2> Job Details: {id}</h2>
        <h3>{job.jobTitle}</h3>
        <button className='bg-blue-500 px-8 py-2 text-white'
        onClick={handleApply}
        >Apply Now</button>
    </div>
  )
}

export default JobDetail
