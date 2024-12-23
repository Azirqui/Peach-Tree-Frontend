import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaClipboardList,
  FaBox,
  FaChartBar,
  FaCogs,
  FaUserCog,
  FaReact,
  FaBuilding,
  FaBell, // Missing import for FaBell
} from 'react-icons/fa';
import { IoAddCircleOutline, IoCreateOutline } from 'react-icons/io5';
import '../css/AdminSidebar.css';
import LogoutButton from './LogoutButton';

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({ orders: false });
  const [activeMenu, setActiveMenu] = useState(''); // Default active menu

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu], // Toggle the menu (true to false or vice versa)
    }));
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu); // Set the active menu when clicked
  };

  return (
    <div className="sidebar bg-gray-900 text-white w-[15%] min-h-screen p-4 flex flex-col z-50">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-8">
        <FaReact className="text-5xl" />
      </div>

      <div className="flex flex-col space-y-6">
        {/* Dashboard Section */}
        <Link
          to="/admin"
          onClick={() => handleMenuClick('dashboard')}
          className={`flex items-center space-x-4 p-2 rounded-lg no-underline ${
            activeMenu === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <FaTachometerAlt className="text-3xl" />
          <span className="text-lg">Dashboard</span>
        </Link>

        {/* Orders Section */}
        <div>
          <div
            onClick={() => toggleMenu('orders')}
            className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer ${
              openMenus.orders || activeMenu.includes('orders')
                ? 'bg-gray-700'
                : 'hover:bg-gray-700'
            }`}
          >
            <FaClipboardList className="text-3xl" />
            <span className="text-lg">Orders</span>
          </div>
          {openMenus.orders && (
            <ul className="pl-8 space-y-2">
              <li>
                <Link
                  to="/admin/order"
                  onClick={() => handleMenuClick('orders-add')}
                  className={`flex items-center space-x-2 p-2 mt-[1rem] rounded-lg no-underline ${
                    activeMenu === 'orders-add' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <IoAddCircleOutline className="text-2xl" />
                  <span>Add Order</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/order-view"
                  onClick={() => handleMenuClick('orders-view')}
                  className={`flex items-center space-x-2 p-2 rounded-lg no-underline ${
                    activeMenu === 'orders-view' ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  <IoCreateOutline className="text-2xl" />
                  <span>View Order</span>
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Products Section */}
        <Link
          to="/admin/product-page"
          onClick={() => handleMenuClick('products')}
          className={`flex items-center space-x-4 p-2 rounded-lg no-underline ${
            activeMenu === 'products' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <FaBox className="text-3xl" />
          <span className="text-lg">Products</span>
        </Link>

        {/* Notifications Section */}
        <Link
          to="/admin/notifications"
          onClick={() => handleMenuClick('notifications')}
          className={`flex items-center space-x-4 p-2 rounded-lg no-underline ${
            activeMenu === 'notifications' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        > 
          <FaBell className="text-3xl" />
          <span className="text-lg">Notifications</span>
        </Link>
        
        {/* Sales Reports Section */}
        <Link
          to="/admin/reports"
          onClick={() => handleMenuClick('salesReports')}
          className={`flex items-center space-x-4 p-2 rounded-lg no-underline ${
            activeMenu === 'salesReports' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <FaChartBar className="text-3xl" />
          <span className="text-lg">Sales Reports</span>
        </Link>

        {/* Suppliers Section */}
        <Link
          to="/admin/supplier-page"
          onClick={() => handleMenuClick('suppliers')}
          className={`flex items-center space-x-4 p-2 rounded-lg no-underline ${
            activeMenu === 'suppliers' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <FaBuilding className="text-3xl" />
          <span className="text-lg">Suppliers</span>
        </Link>

        {/* User Management Section */}
        <Link
          to="/admin/user-management"
          onClick={() => handleMenuClick('user-management')}
          className={`flex items-center space-x-4 p-2 rounded-lg no-underline ${
            activeMenu === 'user-management' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <FaUserCog className="text-3xl" />
          <span className="text-lg">User Management</span>
        </Link>

        {/* Settings Section */}
        <Link
          to="/admin-home/settings"
          onClick={() => handleMenuClick('settings')}
          className={`flex items-center space-x-4 p-2 rounded-lg no-underline ${
            activeMenu === 'settings' ? 'bg-gray-700' : 'hover:bg-gray-700'
          }`}
        >
          <FaCogs className="text-3xl" />
          <span className="text-lg">Settings</span>
        </Link>

        {/* Logout Button */}
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
