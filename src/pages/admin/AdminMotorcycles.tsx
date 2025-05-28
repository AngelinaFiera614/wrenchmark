
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AdminMotorcycles = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Motorcycle Management</h1>
          <p className="text-muted-foreground">
            Manage motorcycles using the modern model-based interface with years and configurations.
          </p>
        </div>
        <Button 
          variant="outline"
          onClick={() => navigate('/admin/motorcycle-models')}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          Go to Motorcycle Models
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-muted-foreground">
              Legacy motorcycle management has been consolidated into the Motorcycle Models interface. 
              Use the modern interface to manage motorcycles with proper year and configuration support.
            </div>
            <Button 
              variant="default"
              onClick={() => navigate('/admin/motorcycle-models')}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Motorcycle Models
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMotorcycles;
