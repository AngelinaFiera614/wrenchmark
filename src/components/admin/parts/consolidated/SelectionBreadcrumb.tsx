
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Building2, Calendar, Settings } from "lucide-react";

interface SelectionBreadcrumbProps {
  selectedModelData?: any;
  selectedYearData?: any;
  selectedConfigData?: any;
}

const SelectionBreadcrumb: React.FC<SelectionBreadcrumbProps> = ({
  selectedModelData,
  selectedYearData,
  selectedConfigData
}) => {
  return (
    <Card className="bg-explorer-card border-explorer-chrome/30">
      <CardContent className="py-3">
        <div className="flex items-center space-x-2 text-sm overflow-x-auto">
          <span className="text-explorer-text-muted whitespace-nowrap">Admin</span>
          <ChevronRight className="h-4 w-4 text-explorer-text-muted flex-shrink-0" />
          <span className="text-explorer-text-muted whitespace-nowrap">Parts & Configurations</span>
          
          {selectedModelData && (
            <>
              <ChevronRight className="h-4 w-4 text-explorer-text-muted flex-shrink-0" />
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Building2 className="h-4 w-4 text-accent-teal flex-shrink-0" />
                <span className="text-explorer-text font-medium">
                  {selectedModelData.brands?.name || 'Unknown Brand'} {selectedModelData.name}
                </span>
              </div>
            </>
          )}
          
          {selectedYearData && (
            <>
              <ChevronRight className="h-4 w-4 text-explorer-text-muted flex-shrink-0" />
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Calendar className="h-4 w-4 text-blue-400 flex-shrink-0" />
                <span className="text-explorer-text font-medium">{selectedYearData.year}</span>
              </div>
            </>
          )}
          
          {selectedConfigData && (
            <>
              <ChevronRight className="h-4 w-4 text-explorer-text-muted flex-shrink-0" />
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Settings className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <span className="text-explorer-text font-medium">{selectedConfigData.name}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectionBreadcrumb;
