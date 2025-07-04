
import React from "react";
import { Navigate } from "react-router-dom";

const AdminAssignments = () => {
  // Component assignments are now handled in Motorcycle Management
  return <Navigate to="/admin/motorcycle-management" replace />;
};

export default AdminAssignments;
