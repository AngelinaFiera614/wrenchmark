
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, DollarSign } from "lucide-react";
import { Motorcycle } from "@/types";

interface MotorcycleYearsFormProps {
  motorcycle: Motorcycle;
  isEditing: boolean;
  onUpdate: (data: Partial<Motorcycle>) => void;
}

const MotorcycleYearsForm = ({ motorcycle, isEditing, onUpdate }: MotorcycleYearsFormProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center justify-between">
            Model Years & Configurations
            {isEditing && (
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Year
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {motorcycle.year && (
              <div className="p-4 bg-explorer-card rounded-lg border border-explorer-chrome/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-accent-teal" />
                    <span className="font-medium text-explorer-text">{motorcycle.year}</span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Active
                    </Badge>
                  </div>
                  {isEditing && (
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-explorer-text-muted">
                    <span className="font-medium">Configurations:</span> 1 (Standard)
                  </div>
                  <div className="text-sm text-explorer-text-muted">
                    <span className="font-medium">Colors:</span> Not configured
                  </div>
                  <div className="text-sm text-explorer-text-muted">
                    <span className="font-medium">MSRP:</span> Not set
                  </div>
                </div>
              </div>
            )}
            
            {!motorcycle.year && (
              <div className="text-center py-8 text-explorer-text-muted">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No model years configured</p>
                <p className="text-sm">Add years to enable trim and pricing configuration</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-explorer-dark border-explorer-chrome/20">
        <CardHeader>
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing & Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Pricing configuration will be available here</p>
            <p className="text-sm">Configure MSRP, options, and color premiums</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleYearsForm;
