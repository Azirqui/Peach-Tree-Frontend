import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import CashierDashboard from './pages/CashierDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import AdminRoutes from './pages/AdminRoutes';
import AdminHome from './pages/AdminHome';
import Reports from './pages/Reports'; // Import the Reports component

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Admin Welcome Page */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute>
              <AdminHome /> {/* Admin welcome page */}
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes /> {/* Nested admin routes with sidebar */}
            </ProtectedRoute>
          }
        />

        {/* Reports Route for Admin */}
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Reports /> {/* Reports page for admin */}
            </ProtectedRoute>
          }
        />

        {/* Protected Cashier Routes */}
        <Route
          path="/cashier/*"
          element={
            <ProtectedRoute>
              <CashierDashboard /> {/* Cashier routes */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
