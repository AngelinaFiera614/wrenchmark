
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Car, RefreshCw } from "lucide-react";

interface TrimLevelActionsProps {
  onCreateNew: () => void;
  onRefresh: () => void;
}

const TrimLevelActions = ({ onCreateNew, onRefresh }: TrimLevelActionsProps) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-explorer-text flex items-center gap-2">
            <Car className="h-5 w-5" />
            Trim Level Management
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              className="ml-2 h-6 w-6 p-0"
              title="Refresh trim levels"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={onCreateNew}
              className="bg-accent-teal text-black hover:bg-accent-teal/80"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Trim Level
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default TrimLevelActions;
