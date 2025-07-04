
import React from "react";
import { Navigate } from "react-router-dom";

const AdminConfigurations = () => {
  // Configuration management is now handled in Motorcycle Management
  return <Navigate to="/admin/motorcycle-management" replace />;
};

export default AdminConfigurations;
