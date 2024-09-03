"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DotsNavigation from '../../components/DotsNavigation';

const ConnectVideo = () => {
  const router = useRouter();
  const [connected, setConnected] = useState(Array(7).fill(false));
  const [userId, setUserId] = useState(''); // Define userId state

  useEffect(() => {
    // Retrieve userId from URL query parameters
    const query = new URLSearchParams(window.location.search);
    const userIdFromQuery = query.get('userId');
    if (userIdFromQuery) {
      setUserId(userIdFromQuery);
    } else {
      console.error('User ID is not available in query parameters.');
    }
  }, []);

  const handleConnect = async (index) => {
    if (index === 0) {
      window.location.href = '/api/connect/whereby'; // This will trigger the OAuth flow
    } else if (index === 1) { 
      window.location.href = '/api/auth/around-connect';
    } else if (index === 6) {  
      window.location.href = '/api/connect/webex'; // This will trigger the OAuth flow for Webex
    } else if (index === 5) { 
      const contact = 'user@example.com'; // Replace with a real contact or dynamic input
      window.location.href = `facetime://${contact}`;
    } else {
      setConnected((prev) => {
        const newConnected = [...prev];
        newConnected[index] = !newConnected[index];
        return newConnected;
      });
    }
  };

  const videoApps = [
    { src: '/icons/whereby.png', alt: 'Whereby', label: 'Whereby' },
    { src: '/icons/around.png', alt: 'Around', label: 'Around' },
    { src: '/icons/riverside.png', alt: 'Riverside', label: 'Riverside' },
    { src: '/icons/pinggg.png', alt: 'Ping.gg', label: 'Ping.gg' },
    { src: '/icons/campfire.png', alt: 'Campfire', label: 'Campfire' },
    { src: '/icons/facetime.png', alt: 'Facetime', label: 'Facetime' },
    { src: '/icons/webex.png', alt: 'Webex', label: 'Webex' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-0 bg-gray-100">
      <header className="mt-4 sm:mt-6 mb-4 text-center">
        <h1 className="text-xl sm:text-xl font-bold text-gray-800">
          Connect your video app
        </h1>
        <p className="mt-1 text-sm sm:text-xs text-gray-600 font-semibold">
          Seamlessly sync your calendar for effortless scheduling
        </p>
      </header>
      <div className="w-full max-w-xs sm:max-w-md p-2 sm:p-4 bg-white rounded-lg shadow-md">
        <ul className="space-y-1 sm:space-y-2">
          {videoApps.map(({ src, alt, label }, index) => (
            <li key={alt} className="flex items-center p-2 bg-gray-100 rounded-lg">
              <img src={src} alt={alt} className="h-6 w-6 sm:h-5 sm:w-5" />
              <span className="ml-3 sm:ml-4 sm:text-xs text-gray-700 font-semibold text-sm">{label}</span>
              <button
                onClick={() => handleConnect(index)}
                className={`ml-auto px-2 sm:px-3 py-1 sm:py-1 text-xs sm:text-xs rounded-lg ${
                  connected[index] ? 'bg-teal-600 text-white' : 'bg-white text-teal-600'
                }`}
              >
                {connected[index] ? 'Connected' : 'Connect'}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => router.push(`/setavailability?userId=${userId}`)}
          className="w-full py-2 sm:py-2 mt-3 sm:mt-4 text-white bg-teal-600 rounded-lg text-sm sm:text-sm">
          Next Step <span className="ml-2 text-lg sm:text-xl">→</span>
        </button>
        <div className="mt-4">
          <DotsNavigation currentStep={2} totalSteps={5} />
        </div>
      </div>
    </div>
  );
};

export default ConnectVideo;
