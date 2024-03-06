import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApplicantsList = () => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/get/applicants')
      .then(response => {
        setApplicants(response.data);
      })
      .catch(error => {
        console.error('Error fetching applicants:', error);
      });
  }, []);

  const sendConfirmation = (email) => {
    alert(`Sending confirmation to ${email}`);
       const sendEmail = (e) => {
      e.preventDefault();
  
      emailjs.sendForm('service_46unuxv', 'template_slg0tgl', form.current, 'xvYuGiqqJHFUMZkN2')
        .then((result) => {
toast.success('waxan kugu soo jawabi donaa sida ugu dhaqsiga badan')
            console.log(result.text);
        }, (error) => {
            toast.error('sorry magudbin fariintadu')
             console.log(error.text);
        });
    };

    // Implement your logic to send confirmation message to the email
    // For example, you can use an email service like Nodemailer or an API for sending emails
  };

  return (
    <div className='max-w-screen container mx-auto xl:px-24 px-4 ml-[400px]'>
      <h2 className='text-2xl font-semibold mb-4 Ml-[20px]'>Applicants List</h2>
      <table className='table-auto'>
        <thead>
          <tr>
            <th className='border px-4 py-2'>Email</th>
            <th className='border px-4 py-2'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map(applicant => (
            <tr key={applicant._id}>
              <td className='border px-4 py-2'>{applicant.email}</td>
              <td className='border px-4 py-2'>
                {applicant.email && (
                  <button onClick={() => sendConfirmation(applicant.email)}>Send Confirmation</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicantsList;
