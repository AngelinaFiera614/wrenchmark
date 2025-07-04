
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PartsManagementSidebar from "./PartsManagementSidebar";
import ComponentsLibraryPage from "./ComponentsLibraryPage";
import BulkOperationsPage from "./BulkOperationsPage";
import MediaLibraryManager from "../media/MediaLibraryManager";
import ColorOptionsManager from "../colors/ColorOptionsManager";

const NewPartsManagementLayout = () => {
  return (
    <div className="min-h-screen bg-explorer-dark flex w-full">
      <PartsManagementSidebar />
      
      <div className="flex-1">
        <Routes>
          <Route path="components" element={<ComponentsLibraryPage />} />
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
