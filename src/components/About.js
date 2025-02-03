import React from "react";
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
        <div className='flex'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')} // Navigate back one step in history
          className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
        >
          {'<'}
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 ml-4">About our support</h1>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        Welcome to our application! We are dedicated to providing the best experience for our users.
      </p>

    </div>
  );
};

export default About;