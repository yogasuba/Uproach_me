"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DotsNavigation from '../../components/DotsNavigation';

const ConnectCalendar = () => {
  const router = useRouter();
  const [connected, setConnected] = useState(Array(8).fill(false)); // Update array size
  const [showAppleModal, setShowAppleModal] = useState(false);
  const [appleCredentials, setAppleCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
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
    if (index === 0) { // Lark Calendar
      window.location.href = '/api/auth/lark';
    } else if (index === 1 || index === 2) { // Microsoft Exchange 2013 or 2016
      handleExchangeConnect(index);
    } else if (index === 5) { // Google Calendar
      const res = await fetch('/api/google');
      const { url } = await res.json();
      window.location.href = url;
    } else if (index === 4) { // Apple Calendar
      setShowAppleModal(true);
    } else if (index === 6) { // Exchange Calendar
      handleExchangeConnect();
    } else if (index === 3) { // Outlook Calendar
      handleOutlookConnect();
    } else {
      // Handle other calendar connections here
      setConnected((prev) => {
        const newConnected = [...prev];
        newConnected[index] = !newConnected[index];
        return newConnected;
      });
    }
  };

  const handleAppleConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/apple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: appleCredentials.email,
          appSpecificPassword: appleCredentials.password,
          userId, // Use userId here
        }),
      });

      const data = await response.json();

      if (data.success) {
        setConnected((prev) => {
          const newConnected = [...prev];
          newConnected[4] = true;
          return newConnected;
        });
        setShowAppleModal(false);
        setAppleCredentials({ email: '', password: '' });
        alert('Apple Calendar connected successfully!');
      } else {
        alert('Failed to connect to Apple Calendar: ' + data.message);
      }
    } catch (error) {
      console.error('Error connecting to Apple Calendar:', error);
      alert('An error occurred while connecting to Apple Calendar.');
    } finally {
      setLoading(false);
    }
  };

  const handleExchangeConnect = async (version) => {
    setLoading(true);
    try {
      const userEmail = prompt('Enter your Exchange email address:');
      
      if (!userEmail) {
        alert('Email address is required to connect to Exchange Calendar.');
        return;
      }

      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, version }) // Sending the email and version to the API
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setConnected((prev) => {
          const newConnected = [...prev];
          newConnected[version] = true; // Mark the corresponding version as connected
          return newConnected;
        });
        alert('Exchange Calendar connected successfully!');
      } else {
        alert('Failed to connect to Exchange Calendar: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error connecting to Exchange Calendar:', error);
      alert('An error occurred while connecting to Exchange Calendar.');
    } finally {
      setLoading(false);
    }
  };

  const handleOutlookConnect = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/outlook');
      if (!response.ok) {
        throw new Error('Failed to fetch Outlook connection URL');
      }
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error connecting to Outlook Calendar:', error);
      alert('An error occurred while connecting to Outlook Calendar.');
    } finally {
      setLoading(false);
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
                  connected[index] ? 'bg-teal-600 text-white' : 'bg-white text-teal-600 border border-teal-600'
                }`}
              >
                {connected[index] ? 'Connected' : 'Connect'}
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => {
            if (userId) {
              router.push(`/connect-video?userId=${userId}`);
            } else {
              console.error('User ID is not available for redirection.');
            }
          }}
          className="w-full py-2 sm:py-2 mt-3 sm:mt-4 text-white bg-teal-600 rounded-lg text-sm sm:text-sm">
          Next Step <span className="ml-2 text-lg sm:text-xl">→</span>
        </button>
        <div className="mt-4">
          <DotsNavigation currentStep={1} totalSteps={5} />
        </div>
      </div>

      {showAppleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Connect to Apple Calendar</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Apple ID Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md p-2"
                value={appleCredentials.email}
                onChange={(e) => setAppleCredentials({ ...appleCredentials, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">App-Specific Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-md p-2"
                value={appleCredentials.password}
                onChange={(e) => setAppleCredentials({ ...appleCredentials, password: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAppleModal(false)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAppleConnect}
                className="px-4 py-2 text-sm text-white bg-teal-600 rounded-lg"
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectCalendar;
