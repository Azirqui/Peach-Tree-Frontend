// src/components/PrivateRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role'); // Retrieve user's role from localStorage

  console.log("Token:", token); // Debugging token
  console.log("User role:", userRole); // Debugging role
  console.log("Required role:", requiredRole); // Debugging required role

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Handle case when userRole is null
  if (requiredRole && (!userRole || userRole.toLowerCase() !== requiredRole.toLowerCase())) {
    return (
      <div className="text-center text-red-500 mt-10">
        Access Denied: You do not have permission to view this page.
      </div>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
