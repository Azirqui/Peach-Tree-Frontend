// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the JWT token and user role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Redirect to the login page after logout
    navigate('/');
  };
  return (
    <button
      onClick={handleLogout}
      className="w-full p-3 mt-4 bg-red-500 text-white rounded-lg text-center font-[Orbitron] text-xl tracking-[8px] cursor-pointer hover:bg-red-600 transition-all"
    >
      Logout
    </button>
  );
};

export default LogoutButton;





// 
