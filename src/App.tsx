
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useAuth } from './context/auth';
import Index from './pages/Index'; // Using existing Index page instead of Home
import MotorcycleDetail from './pages/MotorcycleDetail';
import BrandDetail from './pages/BrandDetail';
import AdminLayout from './components/admin/AdminLayout';
import AdminMotorcycles from './pages/admin/AdminMotorcycles';
import AdminBrands from './pages/admin/AdminBrands';
import AdminManuals from './pages/admin/AdminManuals';
import AdminUsers from './pages/admin/AdminUsers';
import ManualDetail from './pages/ManualDetail';
import AdminMotorcycleGridPage from "./pages/admin/AdminMotorcycleGrid";

function App() {
  const { isAdminVerified } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/motorcycles/:slug" element={<MotorcycleDetail />} />
        <Route path="/brands/:slug" element={<BrandDetail />} />
        <Route path="/manuals/:id" element={<ManualDetail />} />

        {/* Admin Routes - only accessible if isAdminVerified is true */}
        <Route
          path="/admin"
          element={
            isAdminVerified ? (
              <AdminLayout />
            ) : (
              <Navigate to="/" replace />
            )
          }
        >
          <Route path="/admin/motorcycles" element={<AdminMotorcycles />} />
          <Route path="/admin/brands" element={<AdminBrands />} />
          <Route path="/admin/manuals" element={<AdminManuals />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/motorcycles/grid" element={<AdminMotorcycleGridPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
