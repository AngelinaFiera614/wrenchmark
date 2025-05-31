
import React from "react";

const AdminDashboardHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-explorer-text">Admin Dashboard</h1>
        <p className="text-explorer-text-muted mt-1">Welcome to the Wrenchmark admin portal</p>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
