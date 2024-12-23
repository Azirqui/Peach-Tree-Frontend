// src/pages/AdminHome.jsx
import React from 'react';
import Sidebar from '../components/AdminSidebar'; // Import Sidebar
import '../css/AdminHomealt.css';  // Import CSS for AdminHome styles

const AdminHomealt = () => {
  return (
    <div className="admin-home-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="admin-home-content">
        <h1 className="admin-heading">Admin Home</h1>
        
        {/* 3D Rotating Infinity Loop */}
        <div className="infinity-loop-container">
          <div className="infinity-loop"></div>
        </div>
      </div>
    </div>
  );
};
