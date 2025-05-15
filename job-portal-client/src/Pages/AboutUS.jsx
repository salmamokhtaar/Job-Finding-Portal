import React from 'react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  // Team members data
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      bio: 'With over 15 years in HR and recruitment, Sarah founded CareerHub to revolutionize how people find jobs.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      bio: 'Michael leads our tech team, bringing 12 years of experience in building scalable platforms and AI solutions.'
    },
    {
      name: 'Priya Patel',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      bio: 'Priya ensures our platform runs smoothly, managing partnerships with employers and optimizing user experience.'
    },
    {
      name: 'James Wilson',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80',
      bio: 'James drives our growth strategy, connecting job seekers with opportunities through innovative campaigns.'
    }
  ];

  // Company stats
  const stats = [
    { value: '2M+', label: 'Active Users' },
    { value: '85K+', label: 'Companies' },
    { value: '150K+', label: 'Jobs Posted Monthly' },
    { value: '92%', label: 'Success Rate' }
  ];

  return (
    <div className="bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-brand-600 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About CareerHub</h1>
            <p className="text-xl text-white/90 mb-8">
              Connecting talent with opportunity. We're on a mission to make job searching and hiring simpler, more efficient, and more human.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2018, CareerHub began with a simple idea: to create a job platform that puts people first. We noticed that traditional job boards were often impersonal and inefficient, leaving both job seekers and employers frustrated.
              </p>
              <p className="text-gray-700 mb-4">
                We set out to build something different—a platform that uses smart technology to make meaningful connections between talented individuals and the right opportunities. Our team of HR experts, technologists, and design thinkers came together to reimagine the job search experience from the ground up.
              </p>
              <p className="text-gray-700 mb-6">
                Today, CareerHub serves millions of users worldwide, helping people advance their careers and enabling companies to build stronger teams. But we're just getting started. We continue to innovate and improve our platform, guided by our core belief that the right job can change a life.
              </p>
              <Link to="/signup" className="btn btn-primary">Join Our Community</Link>
            </div>
            <div className="order-1 md:order-2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                  alt="Team collaboration" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-6 -left-6 bg-brand-600 text-white p-4 rounded-lg shadow-lg">
                  <p className="font-bold">Est. 2018</p>
                  <p>San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're proud of the difference we're making in the job market and the lives of our users.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-brand-600 mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Mission & Values</h2>
            <p className="text-gray-700 text-lg">
              At CareerHub, we're guided by a set of core principles that inform everything we do.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-handshake text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Meaningful Connections</h3>
              <p className="text-gray-600">
                We believe in creating genuine connections between job seekers and employers based on skills, values, and potential—not just keywords.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-users text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Inclusive Opportunity</h3>
              <p className="text-gray-600">
                We're committed to making the job market more accessible and equitable for everyone, regardless of background or circumstance.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <i className="fas fa-lightbulb text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-3">Continuous Innovation</h3>
              <p className="text-gray-600">
                We constantly push the boundaries of what's possible, using technology to solve real problems in the hiring process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind CareerHub who are dedicated to transforming how the world works.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden group">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-brand-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us in Shaping the Future of Work</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Whether you're looking for your next career move or building your team, CareerHub is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn bg-white text-brand-600 hover:bg-gray-100">
              Create an Account
            </Link>
            <Link to="/contact" className="btn border border-white text-white hover:bg-brand-700">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
