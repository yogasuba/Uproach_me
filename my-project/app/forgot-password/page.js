"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/globals.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage('If an account with that email exists, you will receive a password reset email.');
        setEmail(''); // Clear the email field
      } else {
        setMessage(data.error || 'An error occurred');
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
        <h2 className="text-2xl font-bold mb-1 text-center">Forgot Password</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">Enter your email to receive a password reset link.</p>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-bold text-left text-sm">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-400 rounded-lg text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {message && <p className="text-gray-600 mb-4 text-center">{message}</p>}
          <button type="submit" className="w-full py-3 mb-4 text-white bg-teal-600 rounded-lg">Send Reset Link</button>
        </form>
        <footer className="text-center mt-6 text-xs">
          <p className="text-gray-600">
            Remembered your password? <a href="/signin" className="text-teal-600">Sign in</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ForgotPassword;
