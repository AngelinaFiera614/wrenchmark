
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PartsManagementSidebar from "./PartsManagementSidebar";
import ComponentsLibraryPage from "./ComponentsLibraryPage";
import ModelAssignmentsPage from "./ModelAssignmentsPage";
import ConfigurationManagerPage from "./ConfigurationManagerPage";
import BulkOperationsPage from "./BulkOperationsPage";

const NewPartsManagementLayout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-explorer-dark flex w-full">
      <PartsManagementSidebar />
      
      <div className="flex-1">
        <Routes>
          <Route path="components" element={<ComponentsLibraryPage />} />
          <Route path="assignments" element={<ModelAssignmentsPage />} />
          <Route path="configurations" element={<ConfigurationManagerPage />} />
          <Route path="bulk" element={<BulkOperationsPage />} />
          <Route path="" element={<Navigate to="components" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default NewPartsManagementLayout;
