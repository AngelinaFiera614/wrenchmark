
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import PartsManagementSidebar from "./PartsManagementSidebar";
import ComponentsLibraryPage from "./ComponentsLibraryPage";
import ModelAssignmentsPage from "./ModelAssignmentsPage";
import ConfigurationManagerPage from "./ConfigurationManagerPage";
import BulkOperationsPage from "./BulkOperationsPage";
import ComponentManagementTabs from "../components/ComponentManagementTabs";
import MediaLibraryManager from "../media/MediaLibraryManager";
import ColorOptionsManager from "../colors/ColorOptionsManager";

const NewPartsManagementLayout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-explorer-dark flex w-full">
      <PartsManagementSidebar />
      
      <div className="flex-1">
        <Routes>
          <Route path="components" element={<ComponentsLibraryPage />} />
          <Route path="component-management" element={<ComponentManagementTabs />} />
          <Route path="assignments" element={<ModelAssignmentsPage />} />
          <Route path="configurations" element={<ConfigurationManagerPage />} />
          <Route path="bulk" element={<BulkOperationsPage />} />
          <Route path="media" element={<MediaLibraryManager />} />
          <Route path="colors" element={<ColorOptionsManager />} />
          <Route path="" element={<Navigate to="components" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default NewPartsManagementLayout;
