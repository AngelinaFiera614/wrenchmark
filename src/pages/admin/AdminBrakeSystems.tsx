
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Shield } from "lucide-react";

const AdminBrakeSystems = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Brake Systems</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage brake system components for motorcycle configurations.
          </p>
        </div>
        <Button 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Brake System
        </Button>
      </div>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Brake Systems Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-explorer-text-muted">
              Brake systems management interface coming soon. This will allow you to manage brake types, disc sizes, and ABS configurations.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBrakeSystems;
