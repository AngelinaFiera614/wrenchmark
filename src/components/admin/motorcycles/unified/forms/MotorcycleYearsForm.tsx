
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
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
            Model Years & Trim Levels
            {isEditing && (
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Year
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-explorer-text-muted">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Year and trim management will be integrated here</p>
            <p className="text-sm">This will allow management of different model years and trim levels</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleYearsForm;
