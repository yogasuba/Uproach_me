// app/reset-password/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const [token, setToken] = useState('');

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const token =searchParams.get('token');
    console.log('Received token:', token);
    setToken(token);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage('Invalid or missing token');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage('Password has been reset successfully. Redirecting to Sign In...');
        setTimeout(() => router.push('/signin'), 3000);
      } else {
        setMessage(data.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <header className="text-center mb-8">
        <img src="/logo.png" alt="Logo" className="h-12 mb-1" />
        <p className="text-xs font-bold">Where people come together!</p>
      </header>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md mx-auto">
        <h2 className="text-2xl font-bold mb-1 text-center">Reset Password</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">Enter your new password below.</p>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-bold text-left text-sm">New Password</label>
            <input
              type="password"
              id="password"
              placeholder="New Password"
              className="w-full p-3 border border-gray-400 rounded-lg text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 font-bold text-left text-sm">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              className="w-full p-3 border border-gray-400 rounded-lg text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {message && <p className="text-gray-600 mb-4 text-center">{message}</p>}
          <button type="submit" className="w-full py-3 mb-4 text-white bg-teal-600 rounded-lg">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
