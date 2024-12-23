import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AddOrder from './OrderPage';
import ProductPage from './ProductPage';
import Sidebar from '../components/AdminSidebar';
import ViewOrder from '../components/ViewOrder';
import Reports from "./Reports";
import SupplierPage from './SupplierPage';
import Notifications from '../components/Notifications';
const AdminRoutes = () => {
  return (
    <div className="flex bg-gray-700 h-min-screen">
      <Sidebar />
      <div className="flex-grow p-4">
        <Routes>
          {/* Nested Routes */}
          <Route path="/" element={<AdminDashboard />} />
          <Route path="order" element={<AddOrder />} />
          <Route path="product-page" element={<ProductPage />} />
          <Route path="Notifications" element={<Notifications/>}/>
          <Route path="order-view" element={<ViewOrder />} />
          <Route path="supplier-page" element={<SupplierPage />} />
          <Route path="Reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminRoutes;
