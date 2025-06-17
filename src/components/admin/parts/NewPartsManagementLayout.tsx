
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PartsManagementSidebar from "./PartsManagementSidebar";
import ComponentsLibraryPage from "./ComponentsLibraryPage";
import ModelAssignmentsPage from "./ModelAssignmentsPage";
import ConfigurationManagerPage from "./ConfigurationManagerPage";
import BulkOperationsPage from "./BulkOperationsPage";

const NewPartsManagementLayout = () => {
  return (
    <div className="min-h-screen bg-explorer-dark flex">
      <PartsManagementSidebar />
      
      <Routes>
        <Route path="/components" element={<ComponentsLibraryPage />} />
        <Route path="/assignments" element={<ModelAssignmentsPage />} />
        <Route path="/configurations" element={<ConfigurationManagerPage />} />
        <Route path="/bulk" element={<BulkOperationsPage />} />
        <Route path="/" element={<Navigate to="/admin/parts/components" replace />} />
      </Routes>
    </div>
  );
};

export default NewPartsManagementLayout;
