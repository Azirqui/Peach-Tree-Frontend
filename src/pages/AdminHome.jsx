import React, { useState } from 'react';
import Sidebar from '../components/AdminSidebar'; 
import InfinityLoop from '../components/InfinityLoop'; 
import '../css/AdminHome.css';

const AdminHome = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar((prevState) => !prevState);
  };

  return (
    <div className="admin-home-container bg-gray-700 flex relative">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform transition-transform duration-[800ms] ${
          showSidebar ? 'translate-x-0' : '-translate-x-[120%]'
        } w-64 shadow-lg`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="admin-home-content flex-grow">
        <h1 className="admin-heading text-center text-3xl font-bold my-8">Admin Home</h1>

        {/* Infinity Loop */}
        <div className="infinity-loop-container mx-auto" onClick={toggleSidebar}>
          <InfinityLoop />
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
