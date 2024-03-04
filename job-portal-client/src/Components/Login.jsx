import React from 'react'
import { GoogleAuthProvider,signInWithPopup } from "firebase/auth";
import app from '../firebase/firebase.config'

import { getAuth } from "firebase/auth";

const Login = () => {
  const auth = getAuth();
  const googleprovider = new GoogleAuthProvider();

  const handleLogin = () =>{
    signInWithPopup(auth, googleprovider).then((result) => {
      const user = result.user;
      console.log(user)
    }).catch((error) => {
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
  }
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      <button 
      className='bg-blue-500 text-white  px-8 py-2 '
      onClick={handleLogin}
      >Login</button>
    </div>
  )
}

export default Login