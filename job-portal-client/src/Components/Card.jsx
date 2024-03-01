import React from 'react'
import {Link} from 'react-router-dom'
import '../App.css'
const Card = ({data}) => {

    const {_id,companyName,jobTitle,minPrice,companyLogo,maxPrice,salaryType,jobLocation,employmentType,postingDate,description} = data

  return (
    <section className='card'>
     <Link to={`/job/${_id}`} className='flex gap-4 flex-col sm:flex-row items-start' >
        <img src={companyLogo} alt=''/>
        <div>
            <h4 className='text-primary mb-1'>{companyName}</h4>
            <h3 className='text-lg font-semibold mb-2'>{jobTitle}</h3>

            <div className='text-primary/70 text-base flex flex-wrap gap-2 mb-2'>
        <span className='flex items-center gap-2'><i class="fa-solid fa-location-dot"></i>{jobLocation}</span>
                <span className='flex items-center gap-2' ><i class="fa-regular fa-clock"></i>{employmentType}</span>
             <span className='flex items-center gap-2'><i class="fa-solid fa-dollar-sign">{minPrice}-{maxPrice}</i></span>
                <span className='flex items-center gap-2'><i class="fa-solid fa-calendar-minus">{postingDate}</i></span>
            </div>
            <p className='text-base text-primary/70 '>{description}</p>
        </div>
     </Link>
    </section>
  )
}

export default Card
