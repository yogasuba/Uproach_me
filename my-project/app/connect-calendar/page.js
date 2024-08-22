"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DotsNavigation from '../../components/DotsNavigation';

const ConnectCalendar = () => {
  const router = useRouter();
  const [connected, setConnected] = useState(Array(7).fill(false));

  const handleConnect = async (index) => {
    if (index === 0) { // Assuming Lark Calendar is the 1st in the list
      window.location.href = '/api/auth/lark'; // Directly redirect instead of using fetch
    } else if (index === 5) { // Google Calendar
      const res = await fetch('/api/google');
      const { url } = await res.json();
      window.location.href = url;
    } else {
      // Handle other calendar connections here
      setConnected((prev) => {
        const newConnected = [...prev];
        newConnected[index] = !newConnected[index];
        return newConnected;
      });
    }
  };
  
  

  const calendars = [
    { src: '/icons/lark-calendar.png', alt: 'Lark Calendar', label: 'Lark Calendar' },
    { src: '/icons/exchange-2013.png', alt: 'Microsoft Exchange 2013 Calendar', label: 'Microsoft Exchange 2013' },
    { src: '/icons/exchange-2016.png', alt: 'Microsoft Exchange 2016 Calendar', label: 'Microsoft Exchange 2016' },
    { src: '/icons/outlook.png', alt: 'Outlook Calendar', label: 'Outlook Calendar' },
    { src: '/icons/apple-calendar.png', alt: 'Apple Calendar', label: 'Apple Calendar' },
    { src: '/icons/google-calendar.png', alt: 'Google Calendar', label: 'Google Calendar' },
    { src: '/icons/exchange.png', alt: 'Exchange Calendar', label: 'Exchange Calendar' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-0 bg-gray-100">
      <header className="mt-4 sm:mt-6 mb-4 text-center">
        <h1 className="text-xl sm:text-xl font-bold text-gray-800">
          Connect your calendar
        </h1>
        <p className="mt-1 text-sm sm:text-xs text-gray-600 font-semibold">
          Seamlessly sync your calendar for effortless scheduling
        </p>
      </header>
      <div className="w-full max-w-xs sm:max-w-md p-2 sm:p-4 bg-white rounded-lg shadow-md">
        <ul className="space-y-1 sm:space-y-2">
          {calendars.map(({ src, alt, label }, index) => (
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
          onClick={() => router.push('/connect-video')}
          className="w-full py-2 sm:py-2 mt-3 sm:mt-4 text-white bg-teal-600 rounded-lg text-sm sm:text-sm">
          Next Step <span className="ml-2 text-lg sm:text-xl">→</span>
        </button>
        <div className="mt-4">
          <DotsNavigation currentStep={1} totalSteps={5} />
        </div>
      </div>
    </div>
  );
};

export default ConnectCalendar;
