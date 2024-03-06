// import React from 'react';

// const AboutUs = () => {
//   return (
//     <div className="bg-[#FAFAFA] sm:mt-10 min-h-screen flex flex-col items-center justify-center">
//       <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg flex flex-col md:flex-row">
//         <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0">
//           <img  src='https://images.pexels.com/photos/4348404/pexels-photo-4348404.jpeg?auto=compress&cs=tinysrgb&w=600' alt="About Us" className="rounded-lg w-full h-auto" />
//         </div>
//         <div className="md:w-1/2">
//           <h1 className="text-3xl font-bold text-center md:text-left mb-6">About Our Job Portal</h1>
//           <p className="text-lg mb-4">
//             Our job portal aims to connect job seekers with their dream jobs and help employers find the right talent
//             efficiently. We strive to provide a user-friendly experience for both job seekers and employers,
//             making the job search and recruitment process seamless.
//           </p>
//           <p className="text-lg mb-4">
//             With a wide range of job listings and easy-to-use features, our platform is designed to cater to the
//             diverse needs of the job market. Whether you are looking for a full-time position, part-time job, or
//             internship, our job portal has something for everyone.
//           </p>
//           <p className="text-lg mb-4">
//             We are committed to maintaining a high standard of service and ensuring that our users have a positive
//             experience. Thank you for choosing our job portal for your job search or recruitment needs.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AboutUs;












import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center py-8">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">About Our Job Portal</h1>
        <p className="text-lg mb-4">
          Our job portal is dedicated to helping individuals find meaningful employment opportunities and assisting
          companies in their quest for talent. With our user-friendly interface and advanced search capabilities, we
          strive to make the job search process as efficient and enjoyable as possible.
        </p>
        <p className="text-lg mb-4">
          Whether you're a recent graduate looking for your first job or an experienced professional seeking new
          challenges, our platform offers a wide range of job listings to suit your needs. We partner with leading
          companies across various industries to bring you the latest job openings.
        </p>
        <p className="text-lg mb-4">
          At our job portal, we believe that finding the right job should be a rewarding experience. That's why we
          provide tools and resources to help you navigate the job market with confidence. Join us today and take the
          next step in your career journey!
        </p>
        <div className="flex justify-center mt-8">
          <Link
            to="/contact"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;

