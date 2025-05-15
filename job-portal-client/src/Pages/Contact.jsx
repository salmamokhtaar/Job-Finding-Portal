import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  // Office locations
  const offices = [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 456',
      phone: '+1 (415) 555-1234',
      email: 'sf@careerhub.com'
    },
    {
      city: 'New York',
      address: '789 Broadway, 10th Floor',
      phone: '+1 (212) 555-6789',
      email: 'nyc@careerhub.com'
    },
    {
      city: 'London',
      address: '10 Oxford Street',
      phone: '+44 20 7123 4567',
      email: 'london@careerhub.com'
    }
  ];

  return (
    <div className="bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-brand-600 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-white/90">
              Have questions or feedback? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                    <p className="text-gray-600 flex items-center">
                      <i className="fas fa-envelope text-brand-600 mr-3"></i>
                      <a href="mailto:contact@careerhub.com" className="hover:text-brand-600">
                        contact@careerhub.com
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                    <p className="text-gray-600 flex items-center">
                      <i className="fas fa-phone-alt text-brand-600 mr-3"></i>
                      <a href="tel:+18005551234" className="hover:text-brand-600">
                        +1 (800) 555-1234
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                    <div className="flex space-x-4">
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-brand-100 text-gray-700 hover:text-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-brand-100 text-gray-700 hover:text-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-brand-100 text-gray-700 hover:text-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-100 hover:bg-brand-100 text-gray-700 hover:text-brand-600 transition-colors duration-300 rounded-full w-10 h-10 flex items-center justify-center">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                
                {submitted ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-8 rounded-lg text-center">
                    <div className="text-5xl mb-4">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="mb-4">Your message has been sent successfully. We'll get back to you soon.</p>
                    <button 
                      onClick={() => setSubmitted(false)}
                      className="btn btn-outline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="form-label">Your Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          name="name" 
                          value={formData.name}
                          onChange={handleChange}
                          className="form-input" 
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="form-label">Your Email</label>
                        <input 
                          type="email" 
                          id="email" 
                          name="email" 
                          value={formData.email}
                          onChange={handleChange}
                          className="form-input" 
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="form-label">Subject</label>
                      <input 
                        type="text" 
                        id="subject" 
                        name="subject" 
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-input" 
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="form-label">Message</label>
                      <textarea 
                        id="message" 
                        name="message" 
                        value={formData.message}
                        onChange={handleChange}
                        rows="5" 
                        className="form-input" 
                        placeholder="Your message here..."
                        required
                      ></textarea>
                    </div>
                    
                    <button 
                      type="submit" 
                      className="btn btn-primary w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Offices</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit us at one of our office locations around the world
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-xl font-bold mb-3">{office.city}</h3>
                <div className="space-y-3 text-gray-600">
                  <p className="flex items-start">
                    <i className="fas fa-map-marker-alt mt-1 mr-3 text-brand-600"></i>
                    {office.address}
                  </p>
                  <p className="flex items-start">
                    <i className="fas fa-phone-alt mt-1 mr-3 text-brand-600"></i>
                    {office.phone}
                  </p>
                  <p className="flex items-start">
                    <i className="fas fa-envelope mt-1 mr-3 text-brand-600"></i>
                    {office.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about CareerHub
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-2">How do I create an account?</h3>
                <p className="text-gray-600">
                  You can create an account by clicking on the "Sign Up" button in the top right corner of the page. Follow the instructions to complete your profile.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-2">Is it free to post a job?</h3>
                <p className="text-gray-600">
                  We offer both free and premium job posting options. Free postings include basic features, while premium listings offer enhanced visibility and additional tools.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-2">How can I update my profile?</h3>
                <p className="text-gray-600">
                  Once logged in, you can update your profile by navigating to your dashboard and clicking on the "Edit Profile" button.
                </p>
              </div>
              
              <div className="text-center mt-8">
                <Link to="/faq" className="btn btn-outline">
                  View All FAQs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
