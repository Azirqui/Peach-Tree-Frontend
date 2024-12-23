import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin', // Default to Admin
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false); // State to track if message is an error
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle
  const navigate = useNavigate();

  // Clear token and user data on mount
  useEffect(() => {
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('role'); // Remove the role if previously stored
    localStorage.removeItem('username'); // Remove username if previously stored
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setIsError(false); // Reset error state

      // Submit the login form
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.status !== 200) {
          setMessage(data.message || 'An error occurred');
          setIsError(true); // Set error message state
          return;
        }

        // Save the JWT token
        localStorage.setItem('token', data.token);

        // Save username and role to localStorage for later use
        localStorage.setItem('username', formData.username);
        localStorage.setItem('role', formData.role);

        setMessage('Login successful!');
        setIsError(false); // Set success message state
        setTimeout(() => {
          // Redirect based on the decoded role from the JWT
          const decodedToken = JSON.parse(atob(data.token.split('.')[1])); // Decode JWT payload
          if (decodedToken.role === 'Admin') {
            navigate('/admin-home');
          } else if (decodedToken.role === 'Cashier') {
            navigate('/cashier');
          }
        }, 2000);
      } catch (error) {
        setMessage('Something went wrong!');
        setIsError(true); // Set error message state
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login Form</h2>

        {message && (
          <p className={`text-center mb-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <div className="flex items-center bg-gray-700 rounded">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 bg-transparent focus:outline-none"
              />
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="p-2 text-gray-400 hover:text-white focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block mb-2">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Admin">Admin</option>
              <option value="Cashier">Cashier</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="flex justify-between mt-4">
            <a href="/forgot-password" className="text-sm text-gray-400 hover:underline">
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
