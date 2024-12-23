// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Admin',  // Default to Admin
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility toggle
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Confirm password visibility toggle
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const checkAvailability = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/checkAvailability`.replace(/\/\//g, '/'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
        }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        setMessage(data.message);
        return false;
      }
      return true;
    } catch (error) {
      setMessage('Error checking availability.');
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full Name is required';
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Check availability of username/email
      const available = await checkAvailability();
      if (!available) return;

      setLoading(true); // Start loading

      // Submit the signup form
      try {
        const response = await fetch(`${apiUrl}/auth/signup`.replace(/\/\//g, '/'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.status !== 201) {
          setMessage(data.message || 'An error occurred');
          return;
        }

        setMessage('Signup successful! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setMessage('Something went wrong!');
      } finally {
        setLoading(false); // Stop loading
      }
    } else {
      setMessage('Please fill out the form correctly.');
    }
  };

  // Toggle the password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // Toggle the confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible((prev) => !prev);
  };

  return (
    <div>
      <h2>Signup Form</h2>
      {message && <p style={{ color: message.includes('successful') ? 'green' : 'red' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type={passwordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
          {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type={confirmPasswordVisible ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="button" onClick={toggleConfirmPasswordVisibility}>
            {confirmPasswordVisible ? 'Hide' : 'Show'}
          </button>
          {errors.confirmPassword && <p style={{ color: 'red' }}>{errors.confirmPassword}</p>}
        </div>

        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Admin">Admin</option>
            <option value="Cashier">Cashier</option>
          </select>
          {errors.role && <p style={{ color: 'red' }}>{errors.role}</p>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignupForm;
