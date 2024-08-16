"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import '../../styles/globals.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        const { userId } = data;
        router.push(`/welcome?userId=${userId}`);
      } else {
        // Handle sign-in error (e.g., incorrect password or email not found)
        setError(data.error || 'Sign In failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: `${window.location.origin}/welcome` });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <header className="text-center mb-8">
        <img src="/logo.png" alt="Logo" className="h-12 mb-1" />
        <p className="text-xs font-bold">Where people come together!</p>
      </header>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md mx-auto">
        <h2 className="text-2xl font-bold mb-1 text-center">Welcome back</h2>
        <p className="text-gray-600 mb-6 text-center text-sm">Welcome back! Please enter your details</p>
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
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-bold text-left text-sm">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-400 rounded-lg text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-xs">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-gray-600">Remember for 30 days</label>
            </div>
            <a href="/forgot-password" className="text-teal-600 text-xs">Forgot password</a>
          </div>
          <button type="submit" className="w-full py-3 mb-4 text-white bg-teal-600 rounded-lg">Sign In</button>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full py-3 text-gray-600 text-sm border border-gray-400 rounded-lg"
          >
            <img src="/google-icon.png" alt="Google Icon" className="h-5 mr-2" />
            Sign in with&nbsp;<span className="font-bold">Google</span>
          </button>
        </form>
        <footer className="text-center mt-6 text-xs">
          <p className="text-gray-600">
            Don’t have an account? <a href="/signup" className="text-teal-600">Sign up</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SignIn;
