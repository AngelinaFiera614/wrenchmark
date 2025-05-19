
import React from "react";
import { AdminMotorcycleGrid } from "@/components/admin/motorcycles/AdminMotorcycleGrid";

const AdminMotorcycleGridPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Motorcycle Grid Editor</h1>
        <p className="text-muted-foreground mt-2">
          Spreadsheet-style editor for efficiently managing motorcycle models. Use inline editing for quick updates or the detail view for complete specifications.
        </p>
      </div>

      <AdminMotorcycleGrid />
    </div>
  );
};

export default AdminMotorcycleGridPage;
