// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIsError(false);

    try {
      // Call the backend API to handle password reset
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.status === 200) {
        setMessage('Password reset email sent successfully');
        setIsError(false);
      } else {
        setMessage(data.message || 'An error occurred');
        setIsError(true);
      }
    } catch (error) {
      setMessage('Something went wrong');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>
        
        {message && (
          <p className={`text-center mb-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending request...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
