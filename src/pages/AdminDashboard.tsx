
import React from 'react';
import { Helmet } from 'react-helmet-async';

const AdminDashboard: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Wrenchmark</title>
      </Helmet>
      
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Manage your Wrenchmark content here.
        </p>
        
        {/* Admin dashboard content will go here */}
      </div>
    </>
  );
};

export default AdminDashboard;
