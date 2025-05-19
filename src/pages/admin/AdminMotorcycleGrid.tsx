
import React from "react";
import { AdminMotorcycleGrid } from "@/components/admin/motorcycles/AdminMotorcycleGrid";

const AdminMotorcycleGridPage = () => {
  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6 text-accent-teal">Motorcycles Grid Editor</h1>
      <p className="text-gray-400 mb-8">
        Quickly edit multiple motorcycles in a spreadsheet-like interface.
      </p>
      <AdminMotorcycleGrid />
    </div>
  );
};

export default AdminMotorcycleGridPage;
