import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom'
import { useState } from 'react';
import { useForm } from "react-hook-form"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateUser = () => {
    const { id } = useParams()
    const { username, email, password } = useLoaderData()
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

 
// const onSubmit = (data) => {
//   fetch(`http://localhost:5000/single/user/${id}`,{
//       method: 'PUT',
//       headers: { 'content-type': 'application/json' },
//       body: JSON.stringify(data)
//   }).then(res => res.json()).then((result)=>{
//       console.log(result)
//       if(result.acknowledged === true){
//           alert("User updated successfully")
//           navigate("/users")
//       } 
//       reset()
//   }).catch((error) => {
//       console.error('Error updating user:', error);
//   });
// }
const onSubmit = (data) => {
fetch(`http://localhost:5000/single/user/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
}).then(res => res.json()).then((result) => {
    console.log(result)
    if (result.acknowledged === true) {
        alert("User updated successfully")
        navigate("/users")
    }
    reset()
}).catch((error) => {
    console.error('Error updating user:', error);
});

}

  
    return (
        <div className='max-w-screen container mx-auto xl:px-24 px-4'>

            <div className='bg-[#FAFAFA] px-4 py-10  lg:px-16'>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-5 '>
                    <div className='create-job-flex'>
                        <div className='lg:w1/2 w-full'>
                            <label className='block mb-2 text-lg'>Username</label>
                            <input type="text" defaultValue={username}
                                {...register("username")} className='create-job-input' />
                        </div>
                        <div className='lg:w1/2 w-full'>
                            <label className='block mb-2 text-lg'>Email</label>
                            <input type="email" defaultValue={email}
                                {...register("email")} className='create-job-input' />
                        </div>
                    </div>
                    <div className='create-job-flex'>
                        <div className='lg:w1/2 w-full'>
                            <label className='block mb-2 text-lg'>Password</label>
                            <input type="password" defaultValue={password}
                                {...register("password")} className='create-job-input' />
                        </div>
                    </div>
                    <input type="submit"
                        className='block mt-12 bg-blue-700 textwhite font-semibold px-8 py-2 roumded-sm cursor-pointer text-white'
                    />
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default UpdateUser
