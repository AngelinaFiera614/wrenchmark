
import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";

interface TrimLevelsSectionHeaderProps {
  selectedYearsCount: number;
  onCreateNew: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const TrimLevelsSectionHeader = ({
  selectedYearsCount,
  onCreateNew,
  onRefresh,
  isRefreshing = false
}: TrimLevelsSectionHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-explorer-text">
          Trim Levels ({selectedYearsCount} years selected)
        </CardTitle>
        <div className="flex items-center gap-2">
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="border-explorer-chrome/30 text-explorer-text hover:bg-explorer-chrome/20"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
          <Button
            onClick={onCreateNew}
            className="bg-accent-teal text-black hover:bg-accent-teal/90"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Trim to Selected Years
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default TrimLevelsSectionHeader;
