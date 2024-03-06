import React from 'react'
import { useParams } from 'react-router-dom'
import PageHeader from '../Components/PageHeader'
import { useState,useEffect } from 'react'
import axios from 'axios'
const JobDetail = () => {
    const {id} = useParams()
    const [job,setJobs] = useState([])
    const [email, setEmail] = useState([""])
    useEffect(()=> {
        fetch(`http://localhost:5000/all-jobs/${id}`)
        .then(res => res.json())
        .then((data) => setJobs(data))
    },[])

    // const handleApply =  (e) =>{
    //   e.preventDefault()

    //   axios.post('http://localhost:5000/user/Applicant',{
    //       "email": email
    //   })
    //   .then(()=>{
    //       alert("Email Sent Successfully");
          
    //   }).catch((error)=> console.log(error));
      

    // }
    const handleApply = (e) => {
      e.preventDefault();
    
      // Check if email ends with "@gmail.com"
      if (!email.endsWith("@gmail.com")) {
        alert("Email must be a Gmail address @gmail.com.");
        return;
      }
      // If email is valid, send the request
      axios.post('http://localhost:5000/user/Applicant', {
        "email": email
      }).then(() => {
          alert("Email Sent Successfully");
        }).catch((error) => console.log(error));
    };
    

    
  return (
    <div className='max-w-screen-2xl container mx-auto xl:px-24 px-4'>
        <PageHeader title={"Single Job Page"} path={"Single Job"}/>
        <h2> Job ID: {id}</h2>
        <h2 className='font-bold'> Job Title: {job.jobTitle}</h2>
        <h2 className='font-semibold mt-3 text-blue-500 text-2xl'>Job Details</h2>
        <h3 className='mt-2'> Job Description: {job.description}</h3>
        <h3 className='font-bold'> <i class="fa-solid mt-1 text-2xl font-bold fa-gear"></i>Job Type</h3>
        <button onClick={"/"} className='bg-blue-500 mr-5 rounded px-8 mt-2 py-2 text-white'
        >{job.employmentType}</button>
        <input value={email} onChange={(e)=> setEmail(e.target.value)}
         type='email' id='email' name='email' placeholder = "Email" />
        <button  className='bg-blue-500 px-8 mt-2 py-2 text-white'
        onClick={handleApply}
        >Apply Now</button>
        <div className='sm:flex sm:gap-[140px] mt-20  '>
          <div className=' sm:ml-0'>Benefits
          <div className=' h-[300px]  w-[300px] sm:m-0 m-5'>
            <h1 className='mt-4 text-2xl'>Benefit of this job</h1>
            <h1>1.  $30-50k</h1>
            <h1>2. Disability Insurance</h1>
            <h1>3. Employment Dicount</h1>
            <h1>4. Flexibility Spending Account</h1>
            <h1>5. Paid time off</h1>
          </div>
          </div>
          <div >Outline
          <div className=' h-[300px] w-[300px] sm:m-0 m-5 '>
          <h1 className='mt-4 text-2xl'>Outline of this job</h1>

            <div>
              <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Neque, quasi corrupti. Laudantium unde aut reiciendis mollitia quos omnis, illo quibusdam autem earum quas laboriosam ipsum, nostrum ratione pariatur nulla sed!</p>
            </div>
          </div>
          </div>
          <div>Future Growth
          <h1 className='mt-4 text-2xl'>The Future Growth </h1>

          <div className='h-[300px] w-[300px] sm:m-0 m-5 '>
            <div>
              <p> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum quos, eveniet eos esse adipisci reprehenderit odio, provident sed error modi sunt quas doloribus ad ex, eius temporibus veritatis nulla ipsa! </p>
            </div>
          </div>
          </div>
        </div>
        <div className='' >
          <p>Job Portalis the practice of working from one's home or another space rather than from an office. The practice began at a small scale in the 1970s, when technology was developed that linked satellite offices to downtown mainframes through dumb terminals using telephone lines as a network bridge</p>
          <br/>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam labore unde facilis. Labore reiciendis officia repellat laborum voluptas praesentium sequi, quo iste unde doloremque, pariatur quia porro iusto voluptates quidem? Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis, obcaecati? Voluptates nesciunt magni ipsa commodi repellendus quas qui! In porro excepturi laborum nostrum repudiandae aut, adipisci ab corrupti? Aperiam, totam!</p>
        </div>
    </div>
  )
}

export default JobDetail
