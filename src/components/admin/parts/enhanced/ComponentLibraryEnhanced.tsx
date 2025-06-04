import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import ComponentLibrary from "../ComponentLibrary";
interface ComponentLibraryEnhancedProps {
  selectedConfig: string | null;
  selectedConfigData?: any;
  handleComponentLinked: () => void;
}
const ComponentLibraryEnhanced = ({
  selectedConfig,
  selectedConfigData,
  handleComponentLinked
}: ComponentLibraryEnhancedProps) => {
  return <div className="space-y-6">
      {/* Enhanced Library Header */}
      <Card className="bg-explorer-card border-explorer-chrome/30">
        
        
      </Card>

      {/* Enhanced Component Library */}
      <ComponentLibrary />
    </div>;
};
export default ComponentLibraryEnhanced;