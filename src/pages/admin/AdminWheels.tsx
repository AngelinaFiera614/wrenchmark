
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Wrench } from "lucide-react";

const AdminWheels = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Wheels</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage wheel and tire components for motorcycle configurations.
          </p>
        </div>
        <Button 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Wheel Set
        </Button>
      </div>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Wheel Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-explorer-text-muted">
              Wheel management interface coming soon. This will allow you to manage wheel sizes, tire specifications, and rim materials.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWheels;
