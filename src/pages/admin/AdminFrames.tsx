
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings } from "lucide-react";

const AdminFrames = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-explorer-text">Frames</h1>
          <p className="text-explorer-text-muted mt-1">
            Manage frame components for motorcycle configurations.
          </p>
        </div>
        <Button 
          className="bg-accent-teal text-black hover:bg-accent-teal/80"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Frame
        </Button>
      </div>

      <Card className="bg-explorer-card border-explorer-chrome/30">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Frame Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-explorer-text-muted">
              Frame management interface coming soon. This will allow you to manage frame types, materials, and geometry specifications.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFrames;
