"use client"; // Ensure the component is rendered as a client component

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import '../../styles/globals.css';

const Signup = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    // Password validation (example)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        // Redirect to the welcome page upon successful signup
        router.push('/signin');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to sign up');
      }
    } catch (error) {
      setError('Failed to sign up');
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/welcome' });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <header className="text-center mb-8">
        <img src="/logo.png" alt="Logo" className="h-12 mb-1" />
        <p className="text-xs font-bold">Where people come together!</p>
      </header>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-xl font-bold mb-4 text-center">Plan. Schedule. Thrive.</h2>
        <p className="text-gray-500 mb-6 text-justify text-sm font-semibold text-base">
          Upgrade to our team plan for access to collaborative features, enabling seamless coordination
          and enhanced productivity for group events and projects.
        </p>
        <form className="flex flex-col" onSubmit={handleSignup}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 mb-4 border border-gray-400 rounded-lg text-sm"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 mb-4 border border-gray-400 rounded-lg text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-2 border border-gray-400 rounded-lg text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-gray-500 mb-4 font-normal text-xs">
            • Mix of uppercase & lowercase letters<br />
            • Minimum 8 characters long<br />
            • Contain at least 1 number
          </p>
          <button type="submit" className="w-full py-3 mb-4 text-white bg-teal-600 rounded-lg">Sign up</button>
        </form>
        <button
          type="button"
          className="flex items-center justify-center w-full py-3 text-gray-600 text-sm border border-gray-400 rounded-lg"
          onClick={handleGoogleSignIn}
        >
          <img src="/google-icon.png" alt="Google Icon" className="h-5 mr-2" />
          CONTINUE WITH&nbsp;<span className="font-bold">GOOGLE</span>
        </button>
        <footer className="text-center mt-6 text-xs">
          <p className="text-gray-600">
            By signing up, you agree to our <a href="/terms" className="text-teal-600">Terms of Service</a> and <a href="/privacy" className="text-teal-600">Privacy Policy</a> and <a href="/contact" className="text-teal-600">Get in touch</a>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Signup;
