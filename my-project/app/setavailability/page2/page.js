'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DotsNavigation from '../../../components/DotsNavigation';

const SetAvailability2 = () => {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-0 bg-gray-100">
      <header className="mt-4 sm:mt-6 mb-4 text-center">
        <h1 className="text-xl sm:text-xl font-bold text-gray-800">
          Set your availability
        </h1>
        <p className="mt-1 text-sm sm:text-xs text-gray-600 font-semibold">
          Seamlessly sync your calendar for effortless scheduling
        </p>
      </header>
      <div className="w-full max-w-xs sm:max-w-md p-2 sm:p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-300 overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <svg className="h-8 w-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            id="profilePicInput"
            className="hidden"
            onChange={handleFileChange}
          />
          <label
            htmlFor="profilePicInput"
            className="ml-4 text-xs sm:text-sm font-semibold text-gray-600 border border-gray-300 rounded-lg py-1 px-2 sm:py-2 sm:px-3 cursor-pointer"
          >
            Add profile photo
          </label>
        </div>
        <div className="mb-2 text-left">
          {/* Position "About" label outside the text area */}
          <label htmlFor="about" className="text-sm font-semibold text-gray-700">
            About
          </label>
        </div>
        <textarea
          id="about"
          className="w-full p-2 text-sm sm:text-sm bg-gray-100 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
          rows="5"
        ></textarea>
        {/* Position the description text below the text area */}
        <p className="text-xs text-gray-500 mt-2"> {/* Adjusted margin-top to create space between textarea and text */}
          A few sentences about yourself. This will appear on your personal URL page.
        </p>
        <button
          onClick={() => router.push('/connectvideo')} // Adjust the path as needed
          className="w-full py-2 sm:py-2 mt-4 sm:mt-4 text-white bg-teal-600 rounded-lg text-sm sm:text-sm">
          Next Step <span className="ml-2 text-lg sm:text-xl">→</span>
        </button>
        <div className="mt-4">
          <DotsNavigation currentStep={4} totalSteps={5} />
        </div>
      </div>
    </div>
  );
};

export default SetAvailability2;
