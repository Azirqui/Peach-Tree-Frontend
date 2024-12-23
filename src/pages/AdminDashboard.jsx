import React from 'react';
import { Outlet } from 'react-router-dom';  // For nested routes and getting current location

const AdminDashboard = () => {

  return (
    <div className="admin-dashboard bg-gray-700 flex min-h-screen">
      <div className="content p-6 bg-gray-700">
          <h1 className="text-white text-[300px] ml-[18%]">Admin Dashboard</h1>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
